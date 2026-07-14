const Joi = require("joi");

const createProductValidation = Joi.object({
  name: Joi.string().trim().max(200).required().messages({
    "string.empty": "Product name is required.",
    "any.required": "Product name is required.",
  }),

  shortDescription: Joi.string().trim().max(500).required().messages({
    "string.empty": "Short description is required.",
    "any.required": "Short description is required.",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),

  discountPrice: Joi.number().min(0).max(Joi.ref("price")).default(0).messages({
    "number.min": "Discount price cannot be negative.",
    "number.max": "Discount price cannot be greater than the original price.",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number.",
    "number.min": "Stock cannot be negative.",
    "any.required": "Stock is required.",
  }),

  sku: Joi.string().trim().optional(),

  category: Joi.string().trim().lowercase().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  subcategory: Joi.string().trim().lowercase().optional(),

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),

  featured: Joi.boolean().default(false),

  isActive: Joi.boolean().default(true),

  createdBy: Joi.string().hex().length(24).optional(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().trim().max(200).optional(),

  shortDescription: Joi.string().trim().max(500).optional(),

  description: Joi.string().trim().optional(),

  price: Joi.number().min(0).optional(),

  discountPrice: Joi.number().min(0).max(Joi.ref("price")).optional(),

  stock: Joi.number().integer().min(0).optional(),

  sku: Joi.string().trim().optional(),

  category: Joi.string().trim().lowercase().optional(),

  subcategory: Joi.string().trim().lowercase().optional(),

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),

  featured: Joi.boolean().optional(),

  isActive: Joi.boolean().optional(),

  createdBy: Joi.string().hex().length(24).optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided to update the product.",
});

const productIdParamValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required.",
    "string.hex": "Product ID must be a valid 24-character hexadecimal string.",
    "string.length": "Product ID must be exactly 24 characters long.",
    "any.required": "Product ID is required.",
  }),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
};
