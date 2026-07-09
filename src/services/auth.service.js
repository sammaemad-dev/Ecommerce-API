const User = require("../models/user.model");
const OTP = require("../models/OTP.model");
const tokenService = require("./token.service");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const OTP_EXPIRY_MINUTES = 10;

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Does NOT create the user yet. Stores the OTP + pending user data in the
 * OTP collection with an expiry, then emails the code. The User document
 * is only created in verifyOTP once the code is confirmed.
 */
async function register(data) {
  const email = data.email.trim().toLowerCase();
  const { username, password, phone } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError("Email is already registered", 409);
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw createError("Username is already taken", 409);
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
    throw createError(
      "Could not send verification email. Please try again.",
      502,
    );
  }

  return { email };
}

/**
 * Validates the OTP (existence, expiry, match), creates the User account
 * from the data stored alongside the OTP, then deletes the OTP record.
 * Per the agreed flow, this does NOT auto-login the user — it only
 * confirms account creation; the user logs in separately afterwards.
 */
async function verifyOTP(data) {
  const email = data.email.trim().toLowerCase();
  const { otp } = data;

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    throw createError(
      "OTP not found or already used. Please register again.",
      400,
    );
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw createError("OTP has expired. Please register again.", 400);
  }

  if (otpRecord.otp !== otp) {
    throw createError("Invalid OTP.", 400);
  }

  // Double-check nobody else registered with this email while the OTP was pending.
  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw createError("Email is already registered.", 409);
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

  return { user: formatUserResponse(newUser) };
}

async function login(data) {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw createError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = await tokenService.generateTokens(
    user._id.toString(),
  );

  return { user: formatUserResponse(user), accessToken, refreshToken };
}

async function logout(refreshToken) {
  await tokenService.deleteRefreshToken(refreshToken);
}
async function forgotPassword(data) {
  try {
    const email = data.email.trim().toLowerCase();
    if (!email) throw createError("Email is Required", 400);

    const user = await User.findOne({ email });
    if (!user) throw createError("User Not Found", 404);

    // delete many existing otps for the same email to make sure nothing is being reused
    await Otp.deleteMany({ email });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    // expires in 10 minutes from now
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    const otpRecord = new Otp({
      email,
      otp: hashedOtp,
      expiresAt,
      userData: {
        username: user.username,
        email,
      },
    });
    await otpRecord.save();
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    });
  } catch (e) {
    await OTP.deleteMany({ email });
    throw createError(e.message, e.statusCode);
  }
}

async function resetPassword(data) {}

async function logoutAll(userId) {
  await tokenService.deleteAllRefreshToken(userId);
}

async function refresh(refreshToken) {
  return await tokenService.rotateRefreshToken(refreshToken);
}

function formatUserResponse(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };
}

module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  logoutAll,
  refresh,
};
