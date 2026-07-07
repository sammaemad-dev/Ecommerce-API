const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/auth');

const authMiddleware = async (req, res, next) => {
    const reqToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!reqToken) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        const decodedToken = await verifyAccessToken(reqToken)
        req.user = decodedToken.id
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
        // verify first the Refresh Token
        // if the token was valid generate a new Access Token
        const decodedToken = await verifyRefreshToken(reqToken)
        console.log(decodedToken);
        const newAccessToken = generateAccessToken({ id: decodedToken.id })
        res.json({ accessToken: newAccessToken })

    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

module.exports = { authMiddleware, reGenerateAccessToken }