const express = require("express");
const router = express.Router();

// Haidy: single place that collects every route module and exports
// them together, so app.js just mounts one router under /api
const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");
const cartRoutes = require("./cart.route");
const wishlistRoutes = require("./wishlist.route");
const couponRoutes = require("./coupon.router");
const orderRoutes = require("./order.route");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
