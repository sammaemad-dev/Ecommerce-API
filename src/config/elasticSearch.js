const { Client } = require("@elastic/elasticsearch"); //Elasticsearch Node.js SDK is the official JavaScript library that lets your Node.js application communicate with an Elasticsearch server.

//Client → the class (blueprint) handels => HTTP requests.
//JSON serialization/deserialization.
//Authentication.
//Connection pooling.
//Retries.
//Timeouts.
//Elasticsearch API formatting.

const esClient = new Client({
  //esClient → an object (instance) created from that class
  node: process.env.ELASTIC_SEARCH_URL || "http://localhost:9200", //Elasticsearch exposes its REST API on port 9200 by default
});

module.exports = esClient;
