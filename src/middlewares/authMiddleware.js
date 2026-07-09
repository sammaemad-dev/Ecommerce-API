const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/auth');

const authMiddleware = async (req, res, next) => {
    const reqToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!reqToken) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        const decodedToken = await verifyAccessToken(reqToken)
        // Haidy: fixed key name, payload has "userId" not "id"
        req.user = { _id: decodedToken.userId }
        next()
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

const reGenerateAccessToken = async (req, res, next) => {
    const reqToken = req.body.refreshToken;
    if (!reqToken) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        const decodedToken = await verifyRefreshToken(reqToken)
        console.log(decodedToken);
        // Haidy: same fix here
        const newAccessToken = generateAccessToken({ id: decodedToken.userId })
        res.json({ accessToken: newAccessToken })

    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

module.exports = { authMiddleware, reGenerateAccessToken }
