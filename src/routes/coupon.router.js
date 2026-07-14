const express = require("express");
const couponController = require("../controllers/coupon.controller");
const validate = require("../middlewares/validate.middleware");
const {
  createCouponValidation,
  updateCouponValidation,
  couponIdParamValidation,
} = require("../validation/coupon.validation");

const router = express.Router();

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
