const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const productController = require("../controllers/product.controller");
const {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
} = require("../validation/product.validation");

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  validate(createProductValidation),
  productController.createProduct,
);

router.get("/", productController.getAllProducts);
router.get("/:id", validate(productIdParamValidation), productController.getProductById);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  validate(updateProductValidation),
  productController.updateProduct,
);

router.delete("/:id", authMiddleware, validate(productIdParamValidation), productController.deleteProduct);

module.exports = router;
