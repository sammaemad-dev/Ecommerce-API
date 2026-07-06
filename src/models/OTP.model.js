const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    expiresAt: {
      type: Date,
      required: true,
      // This creates a TTL index. MongoDB will automatically delete
      // the document when the current time matches expiresAt.
      index: { expires: 0 },
    },
    userData: {
      type: Object,
      required: false, // Optional per your requirements
    },
  },
  {
    timestamps: true, // This automatically handles your 'createdAt' and 'updatedAt' fields
  },
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
