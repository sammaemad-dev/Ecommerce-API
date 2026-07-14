const Joi = require("joi");

const createCouponValidation = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).required().messages({
    "string.empty": "Coupon code is required.",
    "any.required": "Coupon code is required.",
    "string.min": "Coupon code must be at least 3 characters.",
    "string.max": "Coupon code cannot exceed 30 characters.",
  }),
  discountType: Joi.string().valid("fixed", "percentage").required().messages({
    "any.only": "Discount type must be either 'fixed' or 'percentage'.",
    "any.required": "Discount type is required.",
  }),
  discountValue: Joi.number().when("discountType", {
    is: "percentage",
    then: Joi.number().min(1).max(100).required().messages({
      "number.base": "Discount value must be a number.",
      "number.min": "Percentage discount must be at least 1%.",
      "number.max": "Percentage discount cannot exceed 100%.",
      "any.required": "Discount value is required.",
    }),
    otherwise: Joi.number().positive().required().messages({
      "number.base": "Discount value must be a number.",
      "number.positive": "Fixed discount must be greater than zero.",
      "any.required": "Discount value is required.",
    }),
  }),
  minOrderAmount: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).allow(null).optional(),
  expiresAt: Joi.date().greater("now").required(),
  isActive: Joi.boolean().default(true),
});

const updateCouponValidation = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).optional(),
  discountType: Joi.string().valid("fixed", "percentage").optional(),
  discountValue: Joi.number().when("discountType", {
    is: "percentage",
    then: Joi.number().min(1).max(100).optional(),
    otherwise: Joi.number().positive().optional(),
  }),
  minOrderAmount: Joi.number().min(0).optional(),
  maxDiscount: Joi.number().min(0).allow(null).optional(),
  expiresAt: Joi.date().greater("now").optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const applyCouponValidation = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).required().messages({
    "string.empty": "Coupon code is required.",
    "any.required": "Coupon code is required.",
  }),
});

const couponIdParamValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.empty": "Coupon ID is required.",
    "string.hex": "Coupon ID must be a valid 24-character hexadecimal string.",
    "string.length": "Coupon ID must be exactly 24 characters long.",
    "any.required": "Coupon ID is required.",
  }),
});

module.exports = {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation,
  couponIdParamValidation,
};
