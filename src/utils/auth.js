require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;


async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}


function generateAccessToken(payload) {

    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' })
}

function generateRefreshToken(payload) {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined');

    }
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })


}

async function verifyAccessToken(token) {

    try {
        const secret = process.env.JWT_ACCESS_SECRET;

        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET is not defined');
        }

        return jwt.verify(token, secret)

    } catch (e) {

        throw new Error("Invalid or exprired token")

    }

}

async function verifyRefreshToken(token) {

    try {
        const secret = process.env.JWT_REFRESH_SECRET;

        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }

        return jwt.verify(token, secret)

    } catch (e) {

        throw new Error("Invalid or exprired token")

    }

}

module.exports = { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken }