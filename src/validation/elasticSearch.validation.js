const Joi = require("joi");

const searchValidation = Joi.object({
  query: Joi.string().trim().min(1).required(),
});

module.exports = {
  searchValidation,
};
