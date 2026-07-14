const asyncHandler = require("express-async-handler");

// Haidy: small helper so authorization errors carry a proper statusCode,
// matching the pattern used in the services (see product.service.js etc.)
// so the global error handler in app.js returns the right status code.
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Haidy: role-based access guard. Use after authMiddleware, e.g.
// router.post("/", authMiddleware, authorization("admin"), controller.create)
const authorization = (...roles) => asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw createError("Unauthorized", 401);
    }
    if (!roles.includes(req.user.role)) {
        throw createError("You are not authorized to access this resource", 403);
    }
    next();
});

module.exports = authorization;
