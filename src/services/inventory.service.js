const Product = require("../models/product.model");

async function deductStock(productId, quantity) {
  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );

  if (!product) {
    throw new Error("Insufficient stock or product not found");
  }

  return product;
}

async function restoreStock(productId, quantity) {
  const product = await Product.findOneAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true },
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

async function updateStock(productId, quantity) { // للأدمن فقط
  if (quantity < 0) {
    throw new Error("Stock cannot be negative");
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock: quantity },
    { new: true , runValidators: true},
  );

  if(!product){
    throw new Error("Product not found");
  }

  return product;
}

async function checkStock(productId, quantity) {

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Out Of stock");
  }

  return product;
}


module.exports ={
    deductStock,
    restoreStock,
    updateStock,
    checkStock
}
