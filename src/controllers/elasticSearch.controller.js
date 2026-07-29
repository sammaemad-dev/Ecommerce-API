const asyncHandler = require("express-async-handler");
const elasticService = require("../services/elasticSearch.service");

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.validatedData;

  const products = await elasticService.searchProducts(query);

  res.status(200).json({
    success: true,
    results: products.length,
    data: products,
  });
});

module.exports = {
  searchProducts,
};
