const User = require("../models/user.model");
const OTP = require("../models/OTP.model");
const tokenService = require("./token.service");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

const OTP_EXPIRY_MINUTES = 10;

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

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
    await OTP.deleteOne({ email });
    throw createError(
      "Could not send verification email. Please try again.",
      502,
    );
  }

  return { email };
}

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

  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw createError("Email is already registered.", 409);
  }

  const { username, password, phone } = otpRecord.userData;

  const newUser = await User.create({
    username,
    email,
    password,
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
    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    // expires in 10 minutes from now
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    const otpRecord = new OTP({
      email,
      otp: hashedOtp,
      expiresAt,
      userData: {
        username: user.username,
        email,
      },
    });
    await otpRecord.save();

    const resetToken = await tokenService.generateResetToken(user);
    const hashedResetToken = await bcrypt.hash(resetToken.resetToken, 10);
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire =
      Date.now() * Number(resetToken.RESET_TOKEN_EXPIRY) * 60 * 1000;
    user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    });

    return resetToken.resetToken;
  } catch (e) {
    throw createError(`${e.message}`, e.statusCode);
  }
}

async function resetPassword(data) {
  try {
    const token = data.token.trim();
    const newPassword = data.newPassword.trim();
    const confirmPassword = data.confirmPassword.trim();
    if (newPassword !== confirmPassword)
      createError("Confirm Password Mismatched", 400);

    const resetPasswordToken = await bcrypt.hash(token, 10);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw createError("Token is invalid or has expired.", 400);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  } catch (e) {
    throw createError(`${e.message}`, e.statusCode);
  }
}

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

// Haidy: Get Profile endpoint logic
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw createError("User not found", 404);
  }
  return { user: formatFullProfile(user) };
}

// Haidy: Update Profile endpoint logic
async function updateProfile(userId, data) {
  const { username, phone, avatar } = data;

  if (username) {
    const existingUsername = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUsername) {
      throw createError("Username is already taken", 409);
    }
  }

  const updateFields = {};
  if (username !== undefined) updateFields.username = username;
  if (phone !== undefined) updateFields.phone = phone;
  if (avatar !== undefined) updateFields.avatar = avatar;

  const user = await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  return { user: formatFullProfile(user) };
}

// Haidy: Change Password endpoint logic (verify current + hash new)
async function changePassword(userId, data) {
  const { currentPassword, newPassword } = data;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw createError("User not found", 404);
  }

  // verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw createError("Current password is incorrect", 401);
  }

  // pre-save hook in user.model.js hashes it automatically
  user.password = newPassword;
  await user.save();

  await tokenService.deleteAllRefreshToken(userId);

  return { message: "Password changed successfully" };
}

function formatFullProfile(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses,
    isVerified: user.isVerified,
  };
}

module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  logoutAll,
  refresh,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};
