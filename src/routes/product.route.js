const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const productController = require("../controllers/product.controller");
const productValidation = require("../validation/product.validation");

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  validate(productValidation),
  productController.createProduct,
);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  validate(productValidation),
  productController.updateProduct,
);

router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
