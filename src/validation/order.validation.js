const Joi = require("joi");
const addressSchema = require("./address.validation");

const orderIdSchema = Joi.string().trim().hex().length(24).required().messages({
  "string.empty": "Order ID is required.",
  "string.hex": "Order ID must be a valid hexadecimal value.",
  "string.length": "Order ID must be exactly 24 characters long.",
  "any.required": "Order ID is required.",
});

const createOrderValidation = Joi.object({
  shippingAddress: addressSchema.required().messages({
    "any.required": "Shipping address details are required.",
  }),

  paymentMethod: Joi.string().valid("cash", "stripe").default("cash").messages({
    "any.only": "Payment method must be either 'cash', 'stripe'.",
  }),

  customerNote: Joi.string().trim().max(500).allow("").default("").messages({
    "string.max": "Customer note cannot exceed 500 characters.",
  }),
});

const orderIdParamValidation = Joi.object({
  id: orderIdSchema,
});

const getMyOrdersValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.integer": "Page must be an integer.",
    "number.min": "Page must be at least 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.integer": "Limit must be an integer.",
    "number.min": "Limit must be at least 1.",
    "number.max": "Limit cannot exceed 100.",
  }),
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    )
    .optional()
    .messages({
      "any.only":
        "Status must be one of: pending, confirmed, processing, shipped, delivered, cancelled, or returned.",
    }),
});

const cancelOrderValidation = Joi.object({
  orderId: orderIdSchema,
});

const adminOrdersFilterValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    )
    .optional(),
  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .optional(),
  sort: Joi.string().valid("asc", "desc").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

const updateOrderStatusValidation = Joi.object({
  orderId: orderIdSchema,
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    )
    .required()
    .messages({
      "any.required": "Order status is required.",
      "any.only": "Invalid order status.",
    }),
});

const cashPaymentValidation = Joi.object({
  orderId: orderIdSchema,
});

const stripeCheckoutValidation = Joi.object({
  orderId: orderIdSchema,
  successUrl: Joi.string().trim().uri().optional().messages({
    "string.uri": "Success URL must be a valid URL.",
  }),
  cancelUrl: Joi.string().trim().uri().optional().messages({
    "string.uri": "Cancel URL must be a valid URL.",
  }),
});

const stripeVerifyValidation = Joi.object({
  orderId: orderIdSchema,
  sessionId: Joi.string()
    .pattern(/^cs_[A-Za-z0-9_]+$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base":
        "Session ID must be a valid Stripe checkout session ID.",
    }),
});

const searchOrdersValidation = {
  query: Joi.object({
    keyword: Joi.string()
      .trim()
      .min(1)
      .required()
      .messages({
        "any.required": "Search keyword is required",
        "string.empty": "Search keyword is required",
        "string.min": "Search keyword cannot be empty",
      }),
  }),
};
module.exports = {
  createOrderValidation,
  orderIdParamValidation,
  getMyOrdersValidation,
  cancelOrderValidation,
  adminOrdersFilterValidation,
  updateOrderStatusValidation,
  cashPaymentValidation,
  stripeCheckoutValidation,
  stripeVerifyValidation,
  searchOrdersValidation
};
