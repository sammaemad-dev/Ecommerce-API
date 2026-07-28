const esClient = require("../config/elasticSearch");

async function syncProduct(product) {
  await esClient.index({
    index: "products",
    id: product._id.toString(),
    document: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    },
  });
}

module.exports = syncProduct;
