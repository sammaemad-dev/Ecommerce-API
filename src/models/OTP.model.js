const mongoose = require("mongoose");

// const pendingUserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//       maxlength: 30,
//     },

//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );

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
    // userData: pendingUserSchema,
  },
  {
    timestamps: true, // handling created and expired date
  },
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
