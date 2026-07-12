require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Test the server is live" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(" MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(" Database Error:");
    console.log(err);
  });