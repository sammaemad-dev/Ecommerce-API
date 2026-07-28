const Category = require("../models/category.model");
const ApiFeatures = require("../utils/apiFeatures");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUtils");
const redisClient = require("../config/redis");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createCategory(data, file, userId) {
  const payload = { ...data, createdBy: userId || data.createdBy }; //data from authenticated user or seed script

  if (!payload.name) {
    throw createError("Category name is required.", 400);
  }
  const existingCategory = await Category.findOne({
    name: payload.name,
  });
  if (existingCategory) {
    throw createError("Category already exists.", 409);
  }
  if (file) {
    payload.image = await uploadToCloudinary(file.path, "categories");
  }
  const category = await Category.create(payload);
  return category;
}

async function getAllCategories(query) {
  const categoryCount = await Category.countDocuments();
  const features = new ApiFeatures(Category.find(), query)
    .filter()
    .sort()
    .limitFields()
    .search(["name"])
    .pagination(categoryCount);
  const categories = await features.mongooseQuery;
  return {
    results: categories.length,
    pagination: features.paginationResult,
    data: categories,
  };
}

async function getCategoryById(categoryId) {
  const cached = await redisClient.get(`category:${categoryId}`);
  if (cached) {
    return (JSON, parse(cached));
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createError("Category not found.", 404);
  }
  await redisClient.set(`category:${categoryId}`, JSON.stringify(category), {
    EX: 300,
  });
  return category;
}

async function updateCategory(categoryId, data, file) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createError("Category not found.", 404);
  }
  const payload = { ...data };
  if (payload.name) {
    const existingCategory = await Category.findOne({
      name: payload.name,
      _id: { $ne: categoryId },
    });
    if (existingCategory) {
      throw createError("Category name already exists.", 409);
    }
  }
  if (file) {
    const uploaded = await uploadToCloudinary(file.path, "categories");
    if (category.image?.public_id) {
      try {
        await deleteFromCloudinary(category.image.public_id);
      } catch (err) {
        console.warn(
          `Could not delete old image ${category.image.public_id}:`,
          err.message,
        );
      }
    }
    payload.image = uploaded;
  }
  Object.assign(category, payload);
  await category.save();
  await redisClient.del(`category:${categoryId}`);
  return category;
}

async function deleteCategory(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createError("Category not found.", 404);
  }
  if (category.image?.public_id) {
    try {
      await deleteFromCloudinary(category.image.public_id);
    } catch (err) {
      console.warn(
        `Could not delete image ${category.image.public_id}:`,
        err.message,
      );
    }
  }
  await category.deleteOne();
  await redisClient.del(`category:${categoryId}`);
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
