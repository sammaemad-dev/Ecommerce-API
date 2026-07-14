const router = require("express").Router();

const wishlistController = require("../controllers/wishlist.controller");
const validate = require("../middlewares/validate.middleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  addToWishlistValidation,
  removeFromWishlistValidation,
} = require("../validation/wishlist.validation");

router.get("/", authMiddleware, wishlistController.getWishlist);

router.post(
  "/",
  authMiddleware,
  validate(addToWishlistValidation),
  wishlistController.addToWishlist,
);

router.delete(
  "/:productId",
  authMiddleware,
  validate(removeFromWishlistValidation),
  wishlistController.removeFromWishlist,
);

router.delete("/", authMiddleware, wishlistController.clearWishlist);

module.exports = router;