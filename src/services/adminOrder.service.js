const Order = require("../models/order.model");
const emailService = require("./email.services"); 
const notificationService = require("./notification.service");

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const allowedStatus = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

async function updateOrderStatus(orderId, data) {
  const { status, adminNote } = data;


  if (!allowedStatus.includes(status)) {
    throw createError("Invalid order status", 400);
  }

  // Find order
  const order = await Order.findById(orderId);

  if (!order) {
    throw createError("Order not found", 404);
  }

  order.status = status;

  if (adminNote) {
    order.adminNote = adminNote;
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  if (status === "cancelled") {
    order.cancelledAt = new Date();
  }

  await order.save();


  try {
    await notificationService.createNotification(
      order.user,
      "Order Status Updated",
      `Your order status has been changed to "${status}".`,
      "order"
    );
  } catch (err) {
    console.error("Notification Error:", err.message);
  }


  try {
    await emailService.sendOrderStatusUpdate(order);
  } catch (err) {
    console.error("Email Error:", err.message);
  }

  return order;
}

module.exports = {
  updateOrderStatus,
};