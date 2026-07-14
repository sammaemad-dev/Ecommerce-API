const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Haidy: all routes (auth/products/carts/wishlist/coupons) are collected
// and exported from routes/index.js, mounted here under /api
const routes = require("./routes/index");

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
