const Joi = require("joi");
const objectId = require("./objectId.validation");

const createCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Category name is required.",
    "string.min": "Category name must be at least 2 characters.",
    "string.max": "Category name cannot exceed 50 characters.",
    "any.required": "Category name is required.",
  }),
  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
  isActive: Joi.boolean().optional(),
});

const updateCategoryValidation = Joi.object({
  id: Joi.string().custom(objectId).required().messages({
    "string.empty": "Category ID is required.",
    "any.invalid": "Invalid category ID.",
    "any.required": "Category ID is required.",
  }),
  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "Category name must be at least 2 characters.",
    "string.max": "Category name cannot exceed 50 characters.",
  }),
  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update the category.",
  });

const categoryIdValidation = Joi.object({
  id: Joi.string().custom(objectId).required().messages({
    "string.empty": "Category ID is required.",
    "any.invalid": "Invalid category ID.",
    "any.required": "Category ID is required.",
  }),
});

const getCategoriesValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.integer": "Page must be an integer.",
    "number.min": "Page must be greater than or equal to 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.integer": "Limit must be an integer.",
    "number.min": "Limit must be at least 1.",
    "number.max": "Limit cannot exceed 100.",
  }),
  sort: Joi.string().trim().optional(),
  fields: Joi.string().trim().optional(),
  search: Joi.string().trim().max(100).optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  getCategoriesValidation,
};
