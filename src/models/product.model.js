const mongoose = require("mongoose");
const slugify = require("slugify");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    slug: {
      //URL-friendly version of a string, usually generated from a product name make them readable and SEO-friendly
      type: String,
      lowercase: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Discount price cannot be greater than the original price.",
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      //stock keeping unit => unique code for each product to identify and track it in inventory
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows multiple documents without an SKU.
      // The unique index is applied only to documents that have an SKU value.
    },
    images: {
      type: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: (images) => images.length > 0,
        message: "At least one image is required.",
      },
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [
      //keywords  help in searching and filtering products
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      // true for special products only
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, //visible for customer and can be bought
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

//To generate slug automatically  => use pre hook

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    //this = current product document
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, //remove special characters like !, ?, &, '
    });
  }
});

//To calculate average rating

productSchema.methods.calcAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0); //reduce() loops through every review and adds up the ratings.
  this.numReviews = this.reviews.length;
  this.averageRating = Number((total / this.numReviews).toFixed(1)); //4.66666 => 4.7
};

//Indexes    => make searching and sorting faster   1 means ascending order (A → Z). -1 means descending order (Z → A)

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema); //creates a Mongoose Model named Product from the productSchema.
module.exports = Product;
