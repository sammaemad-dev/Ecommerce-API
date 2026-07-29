const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "too many requests from this IP , try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "too many requests from this IP , try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,  
});

module.exports = { apiLimit, authLimit };