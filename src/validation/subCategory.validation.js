const Joi = require("joi");
const objectId = require("./objectId.validation");

const createSubCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Subcategory name is required.",
    "string.min": "Subcategory name must be at least 2 characters.",
    "string.max": "Subcategory name cannot exceed 50 characters.",
    "any.required": "Subcategory name is required.",
  }),
  category: Joi.string().custom(objectId).required().messages({
    "string.empty": "Category ID is required.",
    "any.invalid": "Invalid category ID.",
    "any.required": "Category ID is required.",
  }),
  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
  isActive: Joi.boolean().optional(),
});

const updateSubCategoryValidation = Joi.object({
  id: Joi.string().custom(objectId).required().messages({
    "string.empty": "Category ID is required.",
    "any.invalid": "Invalid category ID.",
    "any.required": "Category ID is required.",
  }),
  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "Subcategory name must be at least 2 characters.",
    "string.max": "Subcategory name cannot exceed 50 characters.",
  }),
  category: Joi.string().custom(objectId).optional().messages({
    "any.invalid": "Invalid category ID.",
  }),
  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),

  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update the subcategory.",
  });

const subCategoryIdValidation = Joi.object({
  id: Joi.string().custom(objectId).required().messages({
    "string.empty": "Subcategory ID is required.",
    "any.invalid": "Invalid subcategory ID.",
    "any.required": "Subcategory ID is required.",
  }),
});

const getSubCategoriesValidation = Joi.object({
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
  category: Joi.string().custom(objectId).optional().messages({
    "any.invalid": "Invalid category ID.",
  }),
});

module.exports = {
  createSubCategoryValidation,
  updateSubCategoryValidation,
  subCategoryIdValidation,
  getSubCategoriesValidation,
};
