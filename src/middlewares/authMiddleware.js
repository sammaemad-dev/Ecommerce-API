const tokenService = require('../services/token.service');

const authMiddleware = async (req, res, next) => {
    const reqToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!reqToken) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        const decodedToken = await tokenService.verifyAccessToken(reqToken)
        req.user = { _id: decodedToken.userId }
        next()
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

const reGenerateAccessToken = async (req, res, next) => {
    // Haidy: read the refresh token from the cookie, not the request body
    const reqToken = req.cookies?.refreshToken;
    if (!reqToken) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        // Haidy: use the existing token.service.js function instead of a
        // non-existent generateAccessToken; rotateRefreshToken verifies the
        // refresh token, revokes it, and issues a fresh access + refresh pair
        const { accessToken, refreshToken } = await tokenService.rotateRefreshToken(reqToken)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.json({ accessToken })
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

module.exports = { authMiddleware, reGenerateAccessToken }
