const asyncHandler = require("express-async-handler");
const dashboardService = require("../services/dashboard.service");


const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardAnalytics();

  res.status(200).json({
    success: true,
    message: "Admin dashboard analytics retrieved successfully.",
    data: result,
  });
});

module.exports = {
  getDashboardAnalytics,
};
