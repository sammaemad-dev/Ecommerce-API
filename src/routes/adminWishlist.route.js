const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const validate = require("../middlewares/validate.middleware");
const { adminPaginationValidation } = require("../validation/admin.validation");
const adminWishlistController = require("../controllers/adminWishlist.controller");

router.use(authMiddleware, authorization("admin"));

router.get("/stats", adminWishlistController.getWishlistStats);

router.get(
  "/",
  validate(adminPaginationValidation),
  adminWishlistController.getAllWishlists,
);

module.exports = router;
