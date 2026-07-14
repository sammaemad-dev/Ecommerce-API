const router = require("express").Router();

const wishlistController = require("../controllers/wishlist.controller");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, wishlistController.getWishlist);

router.post("/", authMiddleware, wishlistController.addToWishlist);

router.delete("/:productId", authMiddleware, wishlistController.removeFromWishlist);

router.delete("/", authMiddleware, wishlistController.clearWishlist);

module.exports = router;