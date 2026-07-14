const express = require("express");
const couponController = require("../controllers/coupon.controller");
const validate = require("../middlewares/validate.middleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
// Haidy: coupon management is an admin-only resource
const authorization = require("../middlewares/authorization");
const {
  createCouponValidation,
  updateCouponValidation,
  couponIdParamValidation,
} = require("../validation/coupon.validation");

const router = express.Router();

// Haidy: protect every coupon route below, must be logged in AND an admin
router.use(authMiddleware, authorization("admin"));

router.post(
  "/",
  validate(createCouponValidation),
  couponController.createCoupon,
);
router.get("/", couponController.getCoupons);
router.get("/:id", validate(couponIdParamValidation), couponController.getCouponById);
router.patch(
  "/:id",
  validate(updateCouponValidation),
  couponController.updateCoupon,
);
router.delete("/:id", validate(couponIdParamValidation), couponController.deleteCoupon);

module.exports = router;
