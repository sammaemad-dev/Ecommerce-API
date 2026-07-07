require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const SALT_ROUNDS = 12;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateTokens(userId) {
  const payload = { userId };

  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

async function verifyAccessToken(token) {
  try {
    if (!JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not defined");
    }

    return jwt.verify(token, secret);
  } catch (e) {
    throw new Error("Invalid or exprired token");
  }
}

async function verifyRefreshToken(token) {
  try {
    if (!JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }

    return jwt.verify(token, secret);
  } catch (e) {
    throw new Error("Invalid or exprired token");
  }
}

function deleteRefreshToken(userId) {
  try {
  } catch (error) {
    throw new Error("Error deleting refresh token:", error);
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
  verifyAccessToken,
  
};
