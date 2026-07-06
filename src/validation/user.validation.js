const Joi = require("joi");

const addressValidation = Joi.object({
  country: Joi.string().trim().required(),

  city: Joi.string().trim().required(),

  street: Joi.string().trim().required(),

  zipCode: Joi.string().trim().required(),
});

const updateProfileValidation = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
    }),

  phone: Joi.string().trim(),

  avatar: Joi.string().trim().uri(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  });

const addAddressValidation = addressValidation;

const updateAddressValidation = addressValidation;

const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: Joi.string()
    .min(6)
    .invalid(Joi.ref("currentPassword"))
    .required()
    .messages({
      "any.invalid": "New password must be different from current password",
    }),
});

const wishListItemValidation = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});

module.exports = {
  addressValidation,
  updateProfileValidation,
  addAddressValidation,
  updateAddressValidation,
  changePasswordValidation,
  wishListItemValidation,
};
