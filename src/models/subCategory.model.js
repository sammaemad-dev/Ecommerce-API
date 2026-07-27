const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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

subCategorySchema.index(
  //compound index => name can't be duplicated in the same category
  { name: 1, category: 1 },
  { unique: true },
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
