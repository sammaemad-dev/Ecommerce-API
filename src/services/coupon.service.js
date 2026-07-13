const Coupon = require("../models/coupon.model");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createCoupon(data) {
  const existCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existCoupon) {
    throw createError("Coupon already exists", 409);
  }

  const coupon = await Coupon.create(data);
  return coupon;
}

async function getCoupons() {
  const coupons = await Coupon.find({ isActive: true });

  return coupons;
}

async function getCouponById(id) {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw createError("Coupon not found", 404);
  }
  return coupon;
}

async function updateCoupon(id, data) {
  if (data.code) {
    const exists = await Coupon.findOne({
      code: data.code.toUpperCase(),
      _id: { $ne: id },
    });

    if (exists) {
      throw createError("Coupon already exists", 409);
    }
  }
  const coupon = await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  return coupon;
}

async function deleteCoupon(id) {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw createError("Coupon not found", 404);
  }
  return coupon;
}

async function findValidCoupon(code) {
  //find coupon

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  const now = new Date();

  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  //

  if (!coupon.isActive) {
    throw createError("Coupon is inactive", 400);
  }

  if (coupon.expiresAt < now) {
    throw createError("Coupon has expired", 400);
  }

  return coupon;
}

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  findValidCoupon,
};
