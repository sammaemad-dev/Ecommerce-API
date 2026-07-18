const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

let stripeClient = null;

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error("STRIPE_SECRET_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

module.exports = getStripeClient;
