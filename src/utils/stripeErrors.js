function handleStripeError(error) {
  const appError = new Error(error.message);

  switch (error.type) {
    case "StripeCardError":
      appError.statusCode = 402;
      appError.code = error.code;
      appError.declineCode = error.decline_code || null;
      appError.message = error.message || "Your card was declined.";
      break;

    case "StripeInvalidRequestError":
      appError.statusCode = 400;
      appError.code = error.code || null;
      break;

    case "StripeAuthenticationError":
      appError.statusCode = 500;
      appError.message = "Payment service configuration error.";
      break;

    case "StripeRateLimitError":
      appError.statusCode = 429;
      appError.message = "Too many payment requests. Please try again shortly.";
      break;

    case "StripeConnectionError":
      appError.statusCode = 503;
      appError.message = "Unable to reach the payment provider. Please try again.";
      break;

    case "StripeAPIError":
      appError.statusCode = 502;
      appError.message = "Payment provider error. Please try again.";
      break;

    default:
      appError.statusCode = 500;
      appError.message = error.message || "An unexpected payment error occurred.";
  }

  return appError;
}

module.exports = {
  handleStripeError,
};
