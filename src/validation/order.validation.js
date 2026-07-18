const Joi = require("joi");

const createOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().min(3).max(100).required().trim().messages({
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name cannot exceed 100 characters.",
      "any.required": "Full name is required.",
    }),

    phone: Joi.string().required().trim().messages({
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

    country: Joi.string().required().trim().messages({
      "string.empty": "Country is required.",
      "any.required": "Country is required.",
    }),

    city: Joi.string().required().trim().messages({
      "string.empty": "City is required.",
      "any.required": "City is required.",
    }),

    address: Joi.string().max(500).required().trim().messages({
      "string.empty": "Delivery address is required.",
      "string.max": "Address cannot exceed 500 characters.",
      "any.required": "Delivery address is required.",
    }),

    postalCode: Joi.string().allow("").trim().default(""),
  }).required().messages({
    "any.required": "Shipping address details are required.",
  }),

  paymentMethod: Joi.string()
    .valid("cash", "stripe", "paypal", "paymob")
    .default("cash")
    .messages({
      "any.only": "Payment method must be either 'cash', 'stripe', 'paypal', or 'paymob'.",
    }),

  customerNote: Joi.string().max(500).allow("").trim().default("").messages({
    "string.max": "Customer note cannot exceed 500 characters.",
  }),
});

module.exports = {
  createOrderValidation,
};