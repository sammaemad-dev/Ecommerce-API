const Joi = require("joi");

const registerValidation = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
    }),

  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string().trim().optional(),
});

const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().required(),
});

const verifyOTPValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  otp: Joi.string().trim().length(6).pattern(/^\d+$/).required().messages({
    "string.pattern.base": "OTP must contain only digits",
  }),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

const resetPasswordValidation = Joi.object({
  token: Joi.string().trim().required(),

  password: Joi.string().min(6).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
