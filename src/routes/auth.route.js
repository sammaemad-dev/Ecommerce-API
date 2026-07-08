const {
  register,
  login,
  verifyOTP,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validation/auth.validation");

const router = require("express").Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/verifyOTP", validate(verifyOTPValidation), verifyOTP);
router.post("/logout", logout);
router.post("/forgotPassword", validate(forgotPasswordValidation), forgotPassword);
router.post("/resetPassword", validate(resetPasswordValidation), resetPassword);

module.exports = router;
