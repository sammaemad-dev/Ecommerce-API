const User = require("../models/user.model");
const tokenService = require("./token.service");

async function login(data) {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password", 401);
  }

  const {accessToken, refreshToken} =  await tokenService.generateTokens(user._id.toString());

  const userResponse = this.formatUserResponse(user);

  return { user: formatUserResponse(userResponse), accessToken, refreshToken };
}

async function logout(refreshToken) {
  await tokenService.deleteRefreshToken(refreshToken);
}

async function logoutAll(userId) {
  await tokenService.deleteAllRefreshToken(userId);
}

async function refresh(refreshToken){
    return await tokenService.rotateRefreshToken(refreshToken);
}

function formatUserResponse(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
  };
}

module.exports = {
  login,
  logout,
  logoutAll,
  refresh
};
