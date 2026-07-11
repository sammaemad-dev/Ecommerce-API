const Joi = require("joi");

const productValidation = Joi.object({
  name: Joi.string().trim().max(200),

  shortDescription: Joi.string().trim().max(500),

  description: Joi.string().trim(),

  price: Joi.number().min(0),

  discountPrice: Joi.number().min(0).max(Joi.ref("price")).default(0),

  stock: Joi.number().integer().min(0),

  sku: Joi.string().trim().optional(),

  images: Joi.array().items(
    Joi.object({
      public_id: Joi.string().required(),
      url: Joi.string().required(),
    }),
  ),

  category: Joi.string().trim().lowercase(),

  subcategory: Joi.string().trim().lowercase().optional(),

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()),

  featured: Joi.boolean().default(false),

  isActive: Joi.boolean().default(true),

  createdBy: Joi.string().hex().length(24),
});

module.exports = productValidation;
