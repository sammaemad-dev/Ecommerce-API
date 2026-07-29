require("dotenv").config();
const createProductIndex = require("./utils/createProductIndex");

const app = require("./app");
const mongoose = require("mongoose");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Test the server is live" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      console.log(" MongoDB Connected");

      await redisClient.connect();
      await createProductIndex();

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
