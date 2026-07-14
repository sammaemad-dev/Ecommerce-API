const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router
  .get("/", cartController.getCart)
  .post("/items", cartController.addItem)
  .patch("/items", cartController.updateItemQuantity)
  .delete("/items/:productId", cartController.removeItem)
  .post("/coupon", cartController.applyCoupon)
  .delete("/coupon", cartController.removeCoupon)
  .delete("/clear", cartController.clearCart);

module.exports = router;
