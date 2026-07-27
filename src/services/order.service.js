const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");
const {
  sendOrderConfirmation,
  sendPaymentConfirmation,
} = require("./email.services");

const inventoryService = require("./inventory.service");
const { addOrderHistory } = require("./history.service");
const notificationService = require("./notification.service");

// Create a new order from active cart
const createOrder = async (
  userId,
  { shippingAddress, paymentMethod, customerNote },
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Fetch the user's active cart inside the transaction
    const cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      const error = new Error("Your cart is empty.");
      error.statusCode = 400;
      throw error;
    }

    // Verify stock availability (reads done with the session)
    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product || !product.isActive) {
        const error = new Error(
          `The product "${item.name}" is no longer available.`,
        );
        error.statusCode = 404;
        throw error;
      }
      // if (product.stock < item.quantity) {
      //   const error = new Error(`Insufficient stock for "${item.name}".`);
      //   error.statusCode = 400;
      //   throw error;
      // }
    }

    // Create the order within the transaction
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      discount: cart.discountAmount || 0,
      customerNote,
    });

    // Add initial history record
    await addOrderHistory(order, "pending", null, "Order created");

    await order.save({ session });

    // Update inventory using inventoryService.deductStock for each item.
    // inventoryService.deductStock performs an atomic findOneAndUpdate with stock check,
    // so using it prevents negative stock and preserves business validations.
    for (const item of order.items) {
      await inventoryService.deductStock(item.product, item.quantity, session);
    }

    // Clear the user's cart within the transaction
    cart.items = [];
    cart.coupon = {
      code: null,
      discountType: null,
      discountValue: 0,
      maxDiscount: null,
    };
    await cart.save({ session });

    // Commit the transaction before performing external side-effects (emails)
    await session.commitTransaction();
    session.endSession();

    // Send confirmation email outside transaction to avoid coupling
   // Create notification
try {
  await notificationService.createNotification(
    order.user,
    "Order Created",
    "Your order has been placed successfully.",
    "order"
  );
} catch (err) {
  console.error("Notification Error:", err.message);
}

// Send confirmation email
try {
  await sendOrderConfirmation(order);
} catch (err) {
  console.error("Email Error:", err.message);
}

return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }

};

// Retrieve user's order history
const getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

// Process cash payment for an existing order
const payOrderWithCash = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentMethod !== "cash") {
    const error = new Error("This order is not configured for cash payment.");
    error.statusCode = 400;
    throw error;
  }

  if (order.paymentStatus === "paid") {
    const error = new Error("This order has already been paid.");
    error.statusCode = 400;
    throw error;
  }

  if (["cancelled", "returned"].includes(order.status)) {
    const error = new Error(
      "This order cannot be paid because it is no longer active.",
    );
    error.statusCode = 400;
    throw error;
  }

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.paidAt = new Date();

  // Add history record for status change
  await addOrderHistory(order, "confirmed", null, "Cash payment completed");

  await order.save();

  try {
    await notificationService.createNotification(
      order.user,
      "Payment Successful",
      "Your payment has been received successfully.",
      "payment"
    );
  } catch (err) {
    console.error("Notification Error:", err.message);
  }
  
  try {
    await sendPaymentConfirmation(order);
  } catch (err) {
    console.error("Email Error:", err.message);
  }
  
  return order;
};

async function cancelOrder(userId, orderId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).session(session);

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }

    if (order.status === "cancelled") {
      const error = new Error("This order has already been cancelled.");
      error.statusCode = 400;
      throw error;
    }

    for (const item of order.items) {
      await inventoryService.restoreStock(item.product, item.quantity, session);
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();

    // Add history record for cancellation
    await addOrderHistory(order, "cancelled", null, "Order cancelled by customer");

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    try {
      await notificationService.createNotification(
        order.user,
        "Order Cancelled",
        "Your order has been cancelled.",
        "order"
      );
    } catch (err) {
      console.error("Notification Error:", err.message);
    }
    
    return order;

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

// Update order status (admin only) - encapsulates all business logic for status updates
const updateAdminOrderStatus = async (orderId, newStatus, adminNote) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  const statusChanged = order.status !== newStatus;
  const oldStatus = order.status;

  order.status = newStatus;

  if (adminNote) {
    order.adminNote = adminNote;
  }

  if (newStatus === "delivered") {
    order.deliveredAt = new Date();
  }

  if (newStatus === "cancelled") {
    order.cancelledAt = new Date();
  }

  // Add history record if status changed
  if (statusChanged) {
    const note = adminNote || `Order status changed from ${oldStatus} to ${newStatus}`;
    await addOrderHistory(order, newStatus, null, note);
  }

 await order.save();

try {
  await notificationService.createNotification(
    order.user,
    "Order Updated",
    `Your order status has been updated to ${newStatus}.`,
    "order"
  );
} catch (err) {
  console.error("Notification Error:", err.message);
}

return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  payOrderWithCash,
  cancelOrder,
  updateAdminOrderStatus,
};
