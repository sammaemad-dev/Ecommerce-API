const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      lowercase: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      secure_url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index(
  //Unique index
  { name: 1 },
  { unique: true },
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
