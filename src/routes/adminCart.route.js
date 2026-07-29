const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const validate = require("../middlewares/validate.middleware");
const { adminPaginationValidation } = require("../validation/admin.validation");
const adminCartController = require("../controllers/adminCart.controller");

router.use(authMiddleware, authorization("admin"));

router.get(
  "/",
  validate(adminPaginationValidation),
  adminCartController.getAllCarts,
);

module.exports = router;
