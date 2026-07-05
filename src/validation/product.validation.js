const joi = require("joi");

const productValidation = joi.object({
  name: Joi.string().trim().max(200).required(),

  shortDescription: Joi.string().trim().max(500).required(),

  description: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  discountPrice: Joi.number().min(0).max(Joi.ref("price")).default(0),

  stock: Joi.number().integer().min(0).required(),

  sku: Joi.string().trim().optional(),

  images: Joi.array()
    .items(
      Joi.object({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
      }),
    )
    .min(1)
    .required(),

  category: Joi.string().trim().lowercase().required(),

  subcategory: Joi.string().trim().lowercase().optional(),

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim().lowercase()),

  featured: Joi.boolean().default(false),

  isActive: Joi.boolean().default(true),

  createdBy: Joi.string().hex().length(24).required(),
});

module.exports = productValidation;
