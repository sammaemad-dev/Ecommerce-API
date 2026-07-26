const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const categoryController = require("../controllers/category.controller");
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  getCategoriesValidation,
} = require("../validation/category.validation");

router.post(
  "/",
  authMiddleware,
  authorization("admin"),
  upload.single("image"),
  validate(createCategoryValidation),
  categoryController.createCategory,
);

router.get(
  "/",
  validate(getCategoriesValidation),
  categoryController.getAllCategories,
);
router.get(
  "/:id",
  validate(categoryIdValidation),
  categoryController.getCategoryById,
);

router.put(
  "/:id",
  authMiddleware,
  authorization("admin"),
  upload.single("image"),
  validate(updateCategoryValidation),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  authorization("admin"),
  validate(categoryIdValidation),
  categoryController.deleteCategory,
);

module.exports = router;
