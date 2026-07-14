const couponService = require("../services/coupon.service");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(
    req.validatedData || req.body,
  );

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getCoupons();

  res.status(200).json({
    success: true,
    count: coupons.length,
    message: "Coupons retrieved successfully",
    data: coupons,
  });
});

const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await couponService.getCouponById(id);

  res.status(200).json({
    success: true,
    message: "Coupon retrieved successfully",
    data: coupon,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await couponService.updateCoupon(
    id,
    req.validatedData || req.body,
  );

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await couponService.deleteCoupon(id);

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
