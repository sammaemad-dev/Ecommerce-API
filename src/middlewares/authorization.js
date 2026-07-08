const asyncHandler = require("express-async-handler");

const authorization =(...roles)=> asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error("Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
        throw new Error("You are not authorized to access this resource");
    }
    next();
});

module.exports = authorization;