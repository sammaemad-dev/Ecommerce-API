const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const dashboardController = require("../controllers/dashboard.controller");

router.use(authMiddleware, authorization("admin"));

router.get("/", dashboardController.getDashboardAnalytics);

module.exports = router;
