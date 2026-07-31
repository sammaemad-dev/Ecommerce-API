const Product = require("../models/product.model");
const { getEmbedding } = require("../utils/embedding");
const asyncHandler = require("express-async-handler");

const semanticSearchProducts = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "Query parameter 'q' is required" });

  const queryEmbedding = await getEmbedding(q);

  // Fetch all products that have an embedding
  const products = await Product.find(
    { embedding: { $exists: true, $not: { $size: 0 } } },
    "name description category price embedding"
  );

  // Compute cosine similarity score for each product
  const results = products.map((product) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < queryEmbedding.length; i++) {
      dotProduct += queryEmbedding[i] * product.embedding[i];
      normA += queryEmbedding[i] * queryEmbedding[i];
      normB += product.embedding[i] * product.embedding[i];
    }

    let score = 0;
    if (normA !== 0 && normB !== 0) {
      score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      score,
    };
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  res.json(results.slice(0, Number(limit)));
});

module.exports = {
  semanticSearchProducts,
};