require("dotenv").config();
const asyncHandler = require("express-async-handler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res, next) => {});

const verifyOTP = asyncHandler(async (req, res, next) => {});

const login = asyncHandler(async (req, res, next) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

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

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refresh(refreshToken);

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

const logout = asyncHandler(async (req, res, next) => {
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

const forgotPassword = asyncHandler(async (req, res, next) => {});

const resetPassword = asyncHandler(async (req, res, next) => {});

const getProfile = asyncHandler(async (req, res, next) => {});

module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  refresh
};
