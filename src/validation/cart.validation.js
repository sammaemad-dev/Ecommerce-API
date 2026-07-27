const Joi = require("joi");
const objectId = require("./objectId.validation");

const addItemValidation = Joi.object({
  productId: Joi.string().custom(objectId).required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).default(1).optional().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
  }),
});

const updateItemQuantityValidation = Joi.object({
  // productId: Joi.string().hex().length(24).required().messages({
  productId: Joi.string().custom(objectId).required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
});

const removeItemValidation = Joi.object({
  // productId: Joi.string().hex().length(24).required().messages({
  productId: Joi.string().custom(objectId).required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
});

module.exports = {
  addItemValidation,
  updateItemQuantityValidation,
  removeItemValidation,
};
