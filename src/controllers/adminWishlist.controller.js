const asyncHandler = require("express-async-handler");
const adminWishlistService = require("../services/adminWishlist.service");

// GET /admin/wishlists/stats
const getWishlistStats = asyncHandler(async (req, res) => {
  const stats = await adminWishlistService.getWishlistStats();

  res.status(200).json({
    success: true,
    message: "Top wishlisted products retrieved successfully.",
    count: stats.length,
    data: stats,
  });
});

// GET /admin/wishlists
const getAllWishlists = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedData;

  const { wishlists, pagination } = await adminWishlistService.getAllWishlists(
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    message: "Wishlists retrieved successfully.",
    count: wishlists.length,
    pagination,
    data: wishlists,
  });
});

module.exports = {
  getWishlistStats,
  getAllWishlists,
};
