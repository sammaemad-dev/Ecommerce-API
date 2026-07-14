const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const validate = require("../middlewares/validate.middleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addItemValidation,
  updateItemQuantityValidation,
  removeItemValidation,
} = require("../validation/cart.validation");
const { applyCouponValidation } = require("../validation/coupon.validation");

router.use(authMiddleware);
router
  .get("/", cartController.getCart)
  .post("/items", validate(addItemValidation), cartController.addItem)
  .patch("/items", validate(updateItemQuantityValidation), cartController.updateItemQuantity)
  .delete("/items/:productId", validate(removeItemValidation), cartController.removeItem)
  .post("/coupon", validate(applyCouponValidation), cartController.applyCoupon)
  .delete("/coupon", cartController.removeCoupon)
  .delete("/clear", cartController.clearCart);

module.exports = router;
