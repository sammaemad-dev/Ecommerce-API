const Joi = require("joi");

const registerValidation = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters.",
      "string.max": "Username cannot exceed 30 characters.",
      "string.pattern.base":
        "Username may contain letters, numbers, dots (.), underscores (_), and hyphens (-). It must start and end with a letter or number, and special characters cannot be consecutive.",
      "any.required": "Username is required.",
    }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required.",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password cannot exceed 128 characters.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^01[0125]\d{8}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Invalid phone number. Enter a valid Egyptian mobile number (e.g. 01012345678).",
    }),
});

const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().trim().required(),
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

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
