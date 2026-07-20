const Joi = require("joi");

const addressSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 3 characters long.",
    "string.max": "Full name must not exceed 100 characters.",
    "any.required": "Full name is required.",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base":
        "Phone number must be a valid Egyptian mobile number (e.g. 01012345678).",
      "any.required": "Phone number is required.",
    }),
  country: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Country is required.",
    "string.min": "Country must be at least 2 characters long.",
    "string.max": "Country must not exceed 50 characters.",
    "any.required": "Country is required.",
  }),
  city: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "City is required.",
    "string.min": "City must be at least 2 characters long.",
    "string.max": "City must not exceed 50 characters.",
    "any.required": "City is required.",
  }),
  street: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "Street is required.",
    "string.min": "Street must be at least 5 characters long.",
    "string.max": "Street must not exceed 200 characters.",
    "any.required": "Street is required.",
  }),
  postalCode: Joi.string().trim().max(20).allow("", null).messages({
    "string.max": "Postal code must not exceed 20 characters.",
  }),
});

module.exports = addressSchema;
