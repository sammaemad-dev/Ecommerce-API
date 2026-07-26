const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const subCategoryController = require("../controllers/subCategory.controller");

const {
  createSubCategoryValidation,
  updateSubCategoryValidation,
  subCategoryIdValidation,
  getSubCategoriesValidation,
} = require("../validation/subCategory.validation");

router.post(
  "/",
  authMiddleware,
  authorization("admin"),
  upload.single("image"),
  validate(createSubCategoryValidation),
  subCategoryController.createSubCategory,
);

router.get(
  "/",
  validate(getSubCategoriesValidation),
  subCategoryController.getAllSubCategories,
);
router.get(
  "/:id",
  validate(subCategoryIdValidation),
  subCategoryController.getSubCategoryById,
);

router.put(
  "/:id",
  authMiddleware,
  authorization("admin"),
  upload.single("image"),
  validate(updateSubCategoryValidation),
  subCategoryController.updateSubCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  authorization("admin"),
  validate(subCategoryIdValidation),
  subCategoryController.deleteSubCategory,
);

module.exports = router;
