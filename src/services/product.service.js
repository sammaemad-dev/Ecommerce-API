const Product = require("../models/product.model");
const ApiFeatures = require("../utils/apiFeatures");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUtils");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createProduct(data, files, userId) {
  const payload = { ...data, createdBy: userId || data.createdBy };

  if (!payload.name || !payload.shortDescription || !payload.description || payload.price === undefined || payload.stock === undefined) {
    throw createError("Missing required product fields", 400);
  }

  if (files && files.length > 0) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "products");
      uploadedImages.push(uploaded);
    }

    payload.images = uploadedImages;
  }

  if (!payload.images || payload.images.length === 0) {
    throw createError("At least one product image is required", 400);
  }

  const existingProduct = await Product.findOne({ sku: payload.sku });
  if (payload.sku && existingProduct) {
    throw createError("SKU already exists", 409);
  }

  const product = await Product.create(payload);
  return product;
}

async function getAllProducts(query) {
  const productCount = await Product.countDocuments({ isActive: true });
  const features = new ApiFeatures(Product.find({ isActive: true }), query)
  .filter()
  .sort()
  .limitFields()
  .search(["name"])
  .pagination(productCount);

  const products = await features.mongooseQuery;
  return {
    results: products.length,
    pagination: features.paginationResult,
    data: products,
  };
}

async function getProductById(productId) {
  const product = await Product.findById(productId);

  if (!product) {
    throw createError("Product not found", 404);
  }

  return product;
}

async function updateProduct(productId, data, files) {
  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  const payload = { ...data };

  if (files && files.length > 0) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.path, "products");
      uploadedImages.push(uploaded);
    }

    payload.images = uploadedImages;
  }

  if (payload.sku) {
    const existingProduct = await Product.findOne({
      sku: payload.sku,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      throw createError("SKU already exists", 409);
    }
  }

  if (payload.images && payload.images.length > 0) {
    const oldImages = product.images || [];
    for (const image of oldImages) {
      if (image?.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }
  }

  Object.assign(product, payload);
  await product.save();
  return product;
}

async function deleteProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    throw createError("Product not found", 404);
  }

  for (const image of product.images || []) {
    if (image?.public_id) {
      await deleteFromCloudinary(image.public_id);
    }
  }

  await Product.findByIdAndDelete(productId);
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
