const asyncHandler = require("express-async-handler");
const cartServices = require("../services/cart.services");

const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cart = cartServices.getCart(userId);
  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    cart,
  });
});

const addItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  const cart = cartServices.addItem(userId, productId, quantity);

  res.status(201).json({
    success: true,
    message: "Item added successfully",
    cart,
  });
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  const cart = cartServices.updateItemQuantity(userId, productId, quantity);

  res.status(200).json({
    success: true,
    message: "Quantity updated successfully",
    cart,
  });
});

const removeItem = asyncHandler((req, res) => {
  const { userId, productId } = req.params;
  const cart = cartServices.removeItem(userId, productId);

  res.status(200).json({
    success: true,
    message: "Item removed successfully",
    cart,
  });
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { code, discountType, discountValue } = req.body;
  const cart = cartServices.applyCoupon(
    userId,
    code,
    discountType,
    discountValue,
  );
  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    cart,
  });
});

const removeCoupon = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cart = cartServices.removeCoupon(userId);
  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
    cart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cart = cartServices.removeCoupon(userId);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});

module.exports = [
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
];
