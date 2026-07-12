const {
  register,
  login,
  verifyOTP,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validation/auth.validation");
// Haidy: validation for profile endpoints
const {
  updateProfileValidation,
  changePasswordValidation,
} = require("../validation/user.validation");

const router = require("express").Router();


router.get("/checkAuthHealth", authMiddleware, (req, res) => {
  res.json({ message: "Auth Health is good" });
});


router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/verifyOTP", validate(verifyOTPValidation), verifyOTP);
router.post("/logout", logout);
router.post("/forgotPassword", validate(forgotPasswordValidation), forgotPassword);
router.post("/resetPassword", validate(resetPasswordValidation), resetPassword);

// Haidy: User Profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, validate(updateProfileValidation), updateProfile);
router.put("/change-password", authMiddleware, validate(changePasswordValidation), changePassword);

module.exports = router;
