const asyncHandler = require("express-async-handler");
const cartServices = require("../services/cart.services");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartServices.getCart(userId);
  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    data: cart,
  });
});

const addItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;

  const cart = await cartServices.addItem(userId, productId, quantity);

  res.status(201).json({
    success: true,
    message: "Item added successfully",
    data: cart,
  });
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;

  const cart = await cartServices.updateItemQuantity(
    userId,
    productId,
    quantity,
  );

  res.status(200).json({
    success: true,
    message: "Quantity updated successfully",
    data: cart,
  });
});

const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?._id;
  const cart = await cartServices.removeItem(userId, productId);

  res.status(200).json({
    success: true,
    message: "Item removed successfully",
    data: cart,
  });
});

const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { code, discountType, discountValue } = req.body;
  const cart = await cartServices.applyCoupon(
    userId,
    code,
    discountType,
    discountValue,
  );
  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
});

const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartServices.removeCoupon(userId);
  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
    data: cart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartServices.clearCart(userId);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });
});

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
};
