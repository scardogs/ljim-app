import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "General",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const ShopContentSchema = new mongoose.Schema(
  {
    // Main Section
    title: {
      type: String,
      default: "Shop",
    },
    subtitle: {
      type: String,
      default: "Browse our collection of ministry resources and merchandise.",
    },

    // Products
    products: {
      type: [ProductSchema],
      default: [],
    },

    // Order Information
    googleSheetsUrl: {
      type: String,
      default: "",
    },
    orderInstructions: {
      type: String,
      default:
        "To place an order, please contact us or fill out the order form.",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },

    // Payment Information
    paymentMethods: {
      type: String,
      default: "",
    },
    shippingInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ShopContent ||
  mongoose.model("ShopContent", ShopContentSchema);
