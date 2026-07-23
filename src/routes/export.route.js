const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validate.middleware");

const { exportOrdersValidation } = require("../validation/order.validation");
const { exportOrders } = require("../controllers/export.controller");

router.get(
  "/orders",
  authMiddleware,
  isAdmin,
  validate(exportOrdersValidation),
  exportOrders
);

module.exports = router;
