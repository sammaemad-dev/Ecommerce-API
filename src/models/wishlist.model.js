const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.pre(/^find/, function (next) {
  this.populate("products");
  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;