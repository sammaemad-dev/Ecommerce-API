const asyncHandler = require("express-async-handler");
const orderService = require("../services/order.service");

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { shippingAddress, paymentMethod, customerNote } = req.validatedData;

  const order = await orderService.createOrder(userId, {
    shippingAddress,
    paymentMethod,
    customerNote,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    data: order,
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const orders = await orderService.getUserOrders(userId);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

const payOrderWithCash = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { orderId } = req.validatedData;

  const order = await orderService.payOrderWithCash(userId, orderId);

  res.status(200).json({
    success: true,
    message: "Cash payment completed successfully.",
    data: order,
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  payOrderWithCash,
};