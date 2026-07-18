const Order = require("../models/order.model");
const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");

// Create a new order from active cart
const createOrder = async (userId, { shippingAddress, paymentMethod, customerNote }) => {
  // Fetch the user's active cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    const error = new Error("Your cart is empty.");
    error.statusCode = 400;
    throw error;
  }

  // Verify stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      const error = new Error(`The product "${item.name}" is no longer available.`);
      error.statusCode = 404;
      throw error;
    }
    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for "${item.name}".`);
      error.statusCode = 400;
      throw error;
    }
  }

  // Create the order
  const order = await Order.create({
    user: userId,
    items: cart.items.map(item => ({
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

  // Update inventory in bulk
  const bulkOps = cart.items.map(item => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);

  // Clear the user's cart
  cart.items = [];
  cart.coupon = { code: null, discountType: null, discountValue: 0, maxDiscount: null };
  await cart.save();

  return order;
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
    const error = new Error("This order cannot be paid because it is no longer active.");
    error.statusCode = 400;
    throw error;
  }

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.paidAt = new Date();

  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  payOrderWithCash,
};