const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  adminOrdersFilterValidation,
  searchOrdersValidation,
  updateOrderStatusValidation,
  orderIdParamValidation,
} = require("../validation/order.validation");

const {
  getAllOrders,
  filterOrders,
  searchOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/adminOrder.controller");

router.get("/", authMiddleware, isAdmin, getAllOrders);

router.get(
  "/filter",
  authMiddleware,
  isAdmin,
  validate(adminOrdersFilterValidation),
  filterOrders
);

router.get(
  "/search",
  authMiddleware,
  isAdmin,
  validate(searchOrdersValidation),
  searchOrders
);

router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(orderIdParamValidation),
  getOrderById
);

router.patch(
  "/:id/status",
  authMiddleware,
  isAdmin,
  validate(updateOrderStatusValidation),
  updateOrderStatus
);

module.exports = router;