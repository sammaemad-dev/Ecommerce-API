require("dotenv").config();
const createProductIndex = require("./utils/createProductIndex");

const app = require("./app");
const mongoose = require("mongoose");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Test the server is live" });
});

async function initializeElasticSearch(retries = 10) {
  while (retries > 0) {
    try {
      await createProductIndex();
      console.log("Elasticsearch index is ready.");
      return;
    } catch (err) {
      retries--;
      console.log(`Waiting for Elasticsearch... (${retries} retries left)`);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.error("Could not connect to Elasticsearch.");
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      console.log(" MongoDB Connected", mongoose.connection.db.databaseName);

      await redisClient.connect();
      // await createProductIndex();
      await initializeElasticSearch();

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (err) {
      console.error("Startup Error:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(" Database Error:");
    console.log(err);
  });
