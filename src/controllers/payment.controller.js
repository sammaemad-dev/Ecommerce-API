const asyncHandler = require("express-async-handler");
const paymentService = require("../services/payment.service");

const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const result = await paymentService.handleStripeWebhook(req.body, signature);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  handleStripeWebhook,
};
