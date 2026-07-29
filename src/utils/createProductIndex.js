const esClient = require("../config/elasticSearch");

async function createProductIndex() {
  const exists = await esClient.indices.exists({
    index: "products",
  });

  if (!exists) {
    await esClient.indices.create({
      index: "products",
      mappings: {
        properties: {
          name: { type: "text" },
          shortDescription: { type: "text" },
          description: { type: "text" },
          price: { type: "float" },
          stock: { type: "integer" },
          category: { type: "keyword" },
          subCategory: { type: "keyword" },
          brand: { type: "text" },
          tags: { type: "keyword" },
          averageRating: { type: "float" },
        },
      },
    });

    console.log("Products index created.");
  }
}

module.exports = createProductIndex;
