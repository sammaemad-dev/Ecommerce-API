require("dotenv").config();
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken.model");
const crypto = require("crypto");

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const RESET_TOKEN_SECRET = process.env.JWT_RESET_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const RESET_TOKEN_EXPIRY = "15m";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function generateTokens(userId) {
  const payload = { userId };

  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("One or more token secrets are not defined");
  }

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

  await RefreshToken.create({
    token: hashToken(refreshToken),
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

async function verifyRefreshToken(token) {
  const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);

  const storedToken = await RefreshToken.findOne({ token: hashToken(token) });

  if (!storedToken) {
    throw new Error("Refresh token revoked");
  }
  return payload;
}
async function generateResetToken(user) {
  const payload = { id: user._id, email: user.email };

  const resetToken = jwt.sign(payload, RESET_TOKEN_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRY,
  });

  return { resetToken, RESET_TOKEN_EXPIRY };
}

async function verifyResetToken(token) {
  return jwt.verify(token, RESET_TOKEN_SECRET);
}
async function deleteRefreshToken(refreshToken) {
  await RefreshToken.deleteOne({ token: hashToken(refreshToken) });
}

async function deleteAllRefreshToken(userId) {
  await RefreshToken.deleteMany({ userId });
}

async function rotateRefreshToken(refreshToken) {
  const payload = await verifyRefreshToken(refreshToken);

  await deleteRefreshToken(refreshToken);

  return generateTokens(payload.userId);
}

module.exports = {
  generateTokens,
  generateResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  deleteRefreshToken,
  deleteAllRefreshToken,
  rotateRefreshToken,
};
