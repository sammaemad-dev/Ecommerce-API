require("dotenv").config();

const asyncHandler = require("express-async-handler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const result = await authService.verifyOTP(req.body);

  res.status(201).json({
    success: true,
    message: "Account verified successfully",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.login(req.body);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = await authService.refresh(refreshToken);

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      accessToken,
    });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user._id);

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};