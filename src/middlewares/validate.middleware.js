const validate = (schema) => {
  return (req, res, next) => {
    const inputs = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    const { error, value } = schema.validate(inputs, {
      abortEarly: false,
      stripUnknown: true, //remove unknow, not required fields
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errorCount: error.details.length,
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    req.validatedData = value; //validatedData =  req.body , req.query , req.params
    next();
  };
};

module.exports = validate;
