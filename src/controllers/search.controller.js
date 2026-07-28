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

  const results = await Product.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: Number(limit) * 10,
        limit: Number(limit),
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        category: 1,
        price: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  res.json(results);
});

module.exports = {
  semanticSearchProducts,
};