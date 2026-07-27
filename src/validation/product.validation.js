const Joi = require("joi");
const objectId = require("./objectId.validation");

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

  category: Joi.string().custom(objectId).required().messages({
    //aya : make category model instead of string
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  subCategory: Joi.string().custom(objectId).optional(), //aya : make subCategory model instead of string

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),

  featured: Joi.boolean().default(false),

  isActive: Joi.boolean().default(true),

  // createdBy: Joi.string().custom(objectId).optional(),
});

const updateProductValidation = Joi.object({
  id: Joi.string().custom(objectId).optional(),
  name: Joi.string().trim().max(200).optional(),

  shortDescription: Joi.string().trim().max(500).optional(),

  description: Joi.string().trim().optional(),

  price: Joi.number().min(0).optional(),

  discountPrice: Joi.number().min(0).max(Joi.ref("price")).optional(),

  stock: Joi.number().integer().min(0).optional(),

  sku: Joi.string().trim().optional(),

  category: Joi.string().custom(objectId).optional(), //aya : make category model instead of string

  subCategory: Joi.string().custom(objectId).optional(), //aya : make subCategory model instead of string

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),

  featured: Joi.boolean().optional(),

  isActive: Joi.boolean().optional(),

  // createdBy: Joi.string().custom(objectId).optional(),  //not prefered to be added
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the product.",
  });

const productIdParamValidation = Joi.object({
  id: Joi.string().custom(objectId).required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
});

const getProductsValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional(),
  sort: Joi.string().optional(),
  fields: Joi.string().optional(),
  brand: Joi.string().trim().optional(), //aya: filter by brand
  "price[gte]": Joi.number().optional(), //aya: filter by price
  "price[gt]": Joi.number().optional(),
  "price[lte]": Joi.number().optional(),
  "price[lt]": Joi.number().optional(),
  category: Joi.string().custom(objectId).optional().messages({
    "any.invalid": "Invalid category ID.",
  }),
  subCategory: Joi.string().custom(objectId).optional().messages({
    "any.invalid": "Invalid subcategory ID.",
  }),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
  getProductsValidation,
};
