const Joi = require("joi");

const addToWishlistValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
});

const removeFromWishlistValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
});

module.exports = {
  addToWishlistValidation,
  removeFromWishlistValidation,
};
