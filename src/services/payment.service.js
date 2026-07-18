const getStripeClient = require("../config/stripe");
const Order = require("../models/order.model");
const { restoreStock } = require("./inventory.service");
const { handleStripeError } = require("../utils/stripeErrors");

function getStripeCurrency() {
  return (process.env.STRIPE_CURRENCY || "egp").toLowerCase();
}

function toStripeAmount(totalPrice) {
  return Math.round(totalPrice * 100);
}

function getCheckoutUrls({ successUrl, cancelUrl }) {
  const resolvedSuccessUrl =
    successUrl ||
    process.env.STRIPE_SUCCESS_URL ||
    "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}";

  const resolvedCancelUrl =
    cancelUrl || process.env.STRIPE_CANCEL_URL || "http://localhost:3000/payment/cancel";

  return {
    successUrl: resolvedSuccessUrl.includes("{CHECKOUT_SESSION_ID}")
      ? resolvedSuccessUrl
      : `${resolvedSuccessUrl}${resolvedSuccessUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: resolvedCancelUrl,
  };
}

async function getPayableStripeOrder(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentMethod !== "stripe") {
    const error = new Error("This order is not configured for Stripe payment.");
    error.statusCode = 400;
    throw error;
  }

  if (order.paymentStatus === "paid") {
    const error = new Error("This order has already been paid.");
    error.statusCode = 400;
    throw error;
  }

  if (["cancelled", "returned"].includes(order.status)) {
    const error = new Error("This order cannot be paid because it is no longer active.");
    error.statusCode = 400;
    throw error;
  }

  return order;
}

async function getStripeOrderByMetadata(orderId) {
  return Order.findById(orderId);
}

async function markOrderPaid(order) {
  if (order.paymentStatus === "paid") {
    return order;
  }

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.paidAt = new Date();
  await order.save();

  return order;
}

async function markOrderFailed(order) {
  if (order.paymentStatus === "failed") {
    return order;
  }

  const wasPending = order.paymentStatus === "pending";
  order.paymentStatus = "failed";
  await order.save();

  if (wasPending) {
    for (const item of order.items) {
      await restoreStock(item.product, item.quantity);
    }
  }

  return order;
}

function assertCheckoutSessionMatchesOrder(session, order) {
  if (session.metadata.orderId !== order._id.toString()) {
    const error = new Error("Checkout session does not belong to this order.");
    error.statusCode = 400;
    throw error;
  }
}

async function processCheckoutSessionPayment(session, order) {
  assertCheckoutSessionMatchesOrder(session, order);

  if (session.payment_status === "paid") {
    if (!order.transactionId) {
      order.transactionId = session.id;
      await order.save();
    }

    const paidOrder = await markOrderPaid(order);
    return {
      order: paidOrder,
      paymentStatus: "paid",
      checkoutSessionStatus: session.status,
      checkoutPaymentStatus: session.payment_status,
    };
  }

  if (session.status === "open") {
    const error = new Error("Checkout has not been completed yet.");
    error.statusCode = 400;
    error.checkoutSessionStatus = session.status;
    error.checkoutPaymentStatus = session.payment_status;
    throw error;
  }

  if (session.status === "expired") {
    const error = new Error("Checkout session has expired. Create a new checkout session.");
    error.statusCode = 400;
    error.checkoutSessionStatus = session.status;
    error.checkoutPaymentStatus = session.payment_status;
    throw error;
  }

  await markOrderFailed(order);
  const error = new Error("Checkout payment was not completed.");
  error.statusCode = 402;
  error.checkoutSessionStatus = session.status;
  error.checkoutPaymentStatus = session.payment_status;
  throw error;
}

async function createStripeCheckoutSession(userId, orderId, { successUrl, cancelUrl } = {}) {
  const order = await getPayableStripeOrder(userId, orderId);
  const currency = getStripeCurrency();
  const amount = toStripeAmount(order.totalPrice);
  const stripe = getStripeClient();
  const urls = getCheckoutUrls({ successUrl, cancelUrl });

  if (order.transactionId && order.transactionId.startsWith("cs_")) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(order.transactionId);

      if (existingSession.payment_status === "paid") {
        await markOrderPaid(order);
        const error = new Error("This order has already been paid.");
        error.statusCode = 400;
        throw error;
      }

      if (existingSession.status === "open" && existingSession.url) {
        return {
          checkoutUrl: existingSession.url,
          sessionId: existingSession.id,
          amount: order.totalPrice,
          currency,
        };
      }
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      if (error.type && error.type.startsWith("Stripe")) {
        throw handleStripeError(error);
      }
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Order ${order._id.toString()}`,
              description: `${order.items.length} item(s)`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
    });

    order.transactionId = session.id;
    await order.save();

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      amount: order.totalPrice,
      currency,
    };
  } catch (error) {
    throw handleStripeError(error);
  }
}

async function verifyStripeCheckoutSession(userId, orderId, sessionId) {
  const order = await getPayableStripeOrder(userId, orderId);
  const checkoutSessionId = sessionId || order.transactionId;

  if (!checkoutSessionId) {
    const error = new Error("No checkout session found for this order. Create a checkout session first.");
    error.statusCode = 400;
    throw error;
  }

  if (sessionId && order.transactionId && order.transactionId !== sessionId) {
    const error = new Error("Checkout session does not match this order.");
    error.statusCode = 400;
    throw error;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    return await processCheckoutSessionPayment(session, order);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw handleStripeError(error);
  }
}

async function fulfillCheckoutSessionFromWebhook(session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return null;
  }

  const order = await getStripeOrderByMetadata(orderId);
  if (!order || order.paymentStatus === "paid") {
    return order;
  }

  if (session.payment_status === "paid") {
    order.transactionId = session.id;
    return markOrderPaid(order);
  }

  return order;
}

async function handleStripeWebhook(rawBody, signature) {
  const stripe = getStripeClient();

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    const error = new Error("STRIPE_WEBHOOK_SECRET is not configured.");
    error.statusCode = 500;
    throw error;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const webhookError = new Error(`Webhook signature verification failed: ${error.message}`);
    webhookError.statusCode = 400;
    throw webhookError;
  }

  switch (event.type) {
    case "checkout.session.completed":
      await fulfillCheckoutSessionFromWebhook(event.data.object);
      break;

    case "checkout.session.async_payment_failed":
      await markCheckoutSessionFailed(event.data.object);
      break;

    default:
      break;
  }

  return { received: true, type: event.type };
}

async function markCheckoutSessionFailed(session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return null;
  }

  const order = await getStripeOrderByMetadata(orderId);
  if (!order || order.paymentStatus !== "pending") {
    return order;
  }

  return markOrderFailed(order);
}

module.exports = {
  createStripeCheckoutSession,
  verifyStripeCheckoutSession,
  handleStripeWebhook,
};
