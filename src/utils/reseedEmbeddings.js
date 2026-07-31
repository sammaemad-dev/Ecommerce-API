const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { getEmbedding } = require("./embedding");
require("dotenv").config();

async function reseedEmbeddings() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to reseed.`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // Generate embedding based on product text (name + short description)
      const textToEmbed = `${product.name}. ${product.shortDescription}`;

      console.log(`[${i + 1}/${products.length}] Generating embedding for: ${product.name}`);
      const newEmbedding = await getEmbedding(textToEmbed);

      product.embedding = newEmbedding;
      await product.save({ validateBeforeSave: false });
    }

    console.log("Reseeding complete!");
  } catch (error) {
    console.error("Error during reseeding:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

reseedEmbeddings();
