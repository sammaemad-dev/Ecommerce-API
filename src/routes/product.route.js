const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
// Haidy: only admins are allowed to create/update/delete products
const authorization = require("../middlewares/authorization");
const productController = require("../controllers/product.controller");
const {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
} = require("../validation/product.validation");

// Haidy: admin-only, private route
router.post(
  "/",
  authMiddleware,
  authorization("admin"),
  upload.array("images", 5),
  validate(createProductValidation),
  productController.createProduct,
);

// public routes
router.get("/", productController.getAllProducts);
router.get("/:id", validate(productIdParamValidation), productController.getProductById);

// Haidy: admin-only, private route
router.put(
  "/:id",
  authMiddleware,
  authorization("admin"),
  upload.array("images", 5),
  validate(updateProductValidation),
  productController.updateProduct,
);

// Haidy: admin-only, private route
router.delete(
  "/:id",
  authMiddleware,
  authorization("admin"),
  validate(productIdParamValidation),
  productController.deleteProduct,
);

module.exports = router;
