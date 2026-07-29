const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// Haidy: all routes (auth/products/carts/wishlist/coupons) are collected
// and exported from routes/index.js, mounted here under /api
const routes = require("./routes/index");
const elasticRoutes = require("./routes/elasticSearch.route");
const paymentRoutes = require("./routes/payment.route");

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  paymentRoutes,
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/api/search", elasticRoutes);

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
