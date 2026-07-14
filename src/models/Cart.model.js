const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    coupon: {
      code: {
        type: String,
        uppercase: true,
        default: null,
      },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: null,
      },
      discountValue: {
        type: Number,
        default: 0,
      },
      maxDiscount: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.virtual("discountAmount").get(function () {
  if (!this.coupon || !this.coupon.code) return 0;

  const subtotal = this.subtotal;

  if (this.coupon.discountType === "percentage") {
    const discount = (subtotal * this.coupon.discountValue) / 100;
    if (this.coupon.maxDiscount !== null) {
      return Math.min(discount, this.coupon.maxDiscount);
    }
    return discount;
  }

  if (this.coupon.discountType === "fixed") {
    return Math.min(this.coupon.discountValue, subtotal);
  }

  return 0;
});

cartSchema.virtual("total").get(function () {
  const total = this.subtotal - this.discountAmount;
  return total > 0 ? total : 0;
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
