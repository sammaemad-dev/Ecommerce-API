const isAdmin = (req, res, next) => {
    // Ensure the user is authenticated.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  
    // Allow only users with the admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
  
    next();
  };
  
  module.exports = isAdmin;