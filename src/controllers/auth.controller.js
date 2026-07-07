const User = require("../models/user.model");
const OTP = require("../models/OTP.model");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const OTP_EXPIRY_MINUTES = 10;

/**
 * POST /register
 * Does NOT create the user yet. Instead it:
 *  1. Validates the email/username aren't already taken by a real account.
 *  2. Generates a 6-digit OTP.
 *  3. Stores the OTP + the pending user data in the OTP collection with an
 *     expiry (the schema also has a TTL index as a safety net).
 *  4. Emails the OTP to the user.
 * The actual User document is only created in verifyOTP, once the code
 * is confirmed.
 */
const register = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    // Defensive normalize in case validate.middleware doesn't write the
    // converted (trimmed/lowercased) value back onto req.body.
    const email = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    // Remove any previous pending OTP for this email so old codes can't be reused.
    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OTP.create({
      email,
      otp,
      expiresAt,
      userData: { username, email, password, phone },
    });

    try {
      await sendEmail({
        to: email,
        subject: "Verify your account",
        text: `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      });
    } catch (emailErr) {
      // Roll back the OTP record if we couldn't actually notify the user.
      await OTP.deleteOne({ email });
      console.error("Send OTP email error:", emailErr);
      return res
        .status(502)
        .json({ message: "Could not send verification email. Please try again." });
    }

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

/**
 * POST /verifyOTP
 * Validates the OTP (existence, expiry, match), creates the User account
 * from the data stored alongside the OTP, then deletes the OTP record.
 */
const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not found or already used. Please register again." });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired. Please register again." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Double-check nobody else registered with this email/username while
    // the OTP was pending.
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(409).json({ message: "Email is already registered." });
    }

    const { username, password, phone } = otpRecord.userData;

    const newUser = await User.create({
      username,
      email,
      password, // hashed automatically by the User model's pre-save hook
      phone,
      isVerified: true,
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({
      message: "Account verified and created successfully.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

const forgotPassword = async (req, res) => {};

const resetPassword = async (req, res) => {};

const getProfile = async (req, res) => {};

module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
};