const Joi = require("joi");
const addressSchema = require("./address.validation");
const objectId = require("./objectId.validation");

const orderIdSchema = Joi.string().custom(objectId).required().messages({
  "string.empty": "Order ID is required.",
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
  userId: Joi.string().hex().length(24).optional(),
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
  paymentMethod: Joi.string().valid("cash", "stripe").optional(),

  user: Joi.string().custom(objectId).optional(),
  sort: Joi.string().valid("asc", "desc").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

const exportOrdersValidation = Joi.object({
  format: Joi.string().valid("csv", "xlsx").default("csv").messages({
    "any.only": "Export format must be either 'csv' or 'xlsx'.",
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
    .optional(),
  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .optional(),
  paymentMethod: Joi.string().valid("cash", "stripe").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

const updateOrderStatusValidation = Joi.object({
  id: orderIdSchema,
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
  adminNote: Joi.string().trim().max(1000).optional(),
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

const stripeIntentValidation = Joi.object({
  orderId: orderIdSchema,
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

const searchOrdersValidation = Joi.object({
<<<<<<< HEAD
  //aya: update the previous one
  search: Joi.string().trim().min(1).required().messages({
    "any.required": "Search keyword is required.",
    "string.empty": "Search keyword is required.",
    "string.min": "Search keyword cannot be empty.",
  }),
=======
  keyword: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "any.required": "Search keyword is required",
      "string.empty": "Search keyword is required",
      "string.min": "Search keyword cannot be empty",
    }),
>>>>>>> 06954e417c8330651a7fff3ac3f56654f971b99f
});

module.exports = {
  createOrderValidation,
  orderIdParamValidation,
  getMyOrdersValidation,
  cancelOrderValidation,
  adminOrdersFilterValidation,
  updateOrderStatusValidation,
  cashPaymentValidation,
  stripeCheckoutValidation,
  stripeIntentValidation,
  stripeVerifyValidation,
  searchOrdersValidation,
  exportOrdersValidation
};
