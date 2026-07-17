const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { createOrderValidation } = require("../validation/order.validation");
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

module.exports = router;