const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Haidy: all routes (auth/products/carts/wishlist/coupons) are collected
// and exported from routes/index.js, mounted here under /api
const routes = require("./routes/index");
const paymentRoutes = require("./routes/payment.route");

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  paymentRoutes
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (err.code) {
    response.code = err.code;
  }

  if (err.declineCode) {
    response.declineCode = err.declineCode;
  }

  if (err.checkoutSessionStatus) {
    response.checkoutSessionStatus = err.checkoutSessionStatus;
  }

  if (err.checkoutPaymentStatus) {
    response.checkoutPaymentStatus = err.checkoutPaymentStatus;
  }

  res.status(statusCode).json(response);
});

module.exports = app;
