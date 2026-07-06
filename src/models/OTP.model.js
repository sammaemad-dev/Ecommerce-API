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
      index: { expires: 0 }, // TTL index
    },
    userData: {
      type: Object,
      required: false,
    },
    isUsed: {
      type: Boolean,
    },
  },
  {
    timestamps: true, // handling created and expired date
  },
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
