const crypto = require("crypto");

/**
 * Generates a random 6-digit numeric OTP as a string (e.g. "042951").
 * Uses crypto.randomInt for a cryptographically stronger random number
 * than Math.random().
 */
function generateOTP() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

module.exports = generateOTP;
