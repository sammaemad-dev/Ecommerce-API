const asyncHandler = require("express-async-handler");
const adminCartService = require("../services/adminCart.service");

// GET /admin/cart
const getAllCarts = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedData;

  const { carts, pagination } = await adminCartService.getAllCarts(page, limit);

  res.status(200).json({
    success: true,
    message: "Carts retrieved successfully.",
    count: carts.length,
    pagination,
    data: carts,
  });
});

module.exports = {
  getAllCarts,
};
