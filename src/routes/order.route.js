const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createOrderValidation,
  cashPaymentValidation,
  stripeCheckoutValidation,
  stripeVerifyValidation,
} = require("../validation/order.validation");
const validate = require("../middlewares/validate.middleware");
const orderController = require("../controllers/order.controller")

// Route to get the authenticated user's order history
router.get("/", authMiddleware, orderController.getUserOrders);

// Route to place a new order
router.post(
  "/",
  authMiddleware,
  validate(createOrderValidation),
  orderController.createOrder
);

// Route to complete cash payment for an existing order
router.post(
  "/:orderId/pay/cash",
  authMiddleware,
  validate(cashPaymentValidation),
  orderController.payOrderWithCash
);

// Route to create a Stripe Checkout Session for an existing order
router.post(
  "/:orderId/pay/stripe/checkout",
  authMiddleware,
  validate(stripeCheckoutValidation),
  orderController.createStripeCheckoutSession
);

// Route to verify a Stripe Checkout Session after payment
router.post(
  "/:orderId/pay/stripe/verify",
  authMiddleware,
  validate(stripeVerifyValidation),
  orderController.verifyStripeCheckoutSession
);

module.exports = router;