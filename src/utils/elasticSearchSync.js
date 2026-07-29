const esClient = require("../config/elasticSearch");
//client is Lazy Connection => not connect Elasticsearch Client immediatly until The first request (such as search() or index()) automatically opens the connection

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
      category: product.category?.name || product.category,
      subCategory: product.subCategory?.name || product.subCategory,
      brand: product.brand,
      tags: product.tags,
      averageRating: product.averageRating,
    },
  });
}

async function deleteProductFromIndex(id) {
  await esClient.delete({
    index: "products",
    id: id.toString(),
  });
}

module.exports = { syncProduct, deleteProductFromIndex };
