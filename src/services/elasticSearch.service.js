const esClient = require("../config/elasticSearch");

async function searchProducts(query) {
  const result = await esClient.search({
    index: "products",
    query: {
      multi_match: {
        query,
        fields: [
          "name^3", //^3 means 3× more important =>.Give this field more importance when calculating the relevance score
          "shortDescription^2",
          "description",
        ],
      },
    },
  });

  return result.hits.hits.map((hit) => ({
    //return the array of documents that matched the search query
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));
}

module.exports = {
  searchProducts,
};
