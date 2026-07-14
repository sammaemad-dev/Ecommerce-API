const Joi = require("joi");

const addItemValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).default(1).optional().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
  }),
});

const updateItemQuantityValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
});

const removeItemValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
});

module.exports = {
  addItemValidation,
  updateItemQuantityValidation,
  removeItemValidation,
};
