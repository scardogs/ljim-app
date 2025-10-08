import mongoose from "mongoose";

const GiveContentSchema = new mongoose.Schema(
  {
    // Main Section
    title: {
      type: String,
      default: "Give",
    },
    subtitle: {
      type: String,
      default: "Support our ministry through your generous contributions.",
    },

    // How to Give Section
    howToGiveTitle: {
      type: String,
      default: "How to Give",
    },
    howToGiveDescription: {
      type: String,
      default: "You can give online or in person during our services.",
    },
    buttonText: {
      type: String,
      default: "Give Now",
    },

    // QR Code
    qrCodeImage: {
      type: String,
      default: "/images/qrcode.png",
    },
    qrCodeTimeout: {
      type: Number,
      default: 60, // seconds
    },

    // Additional Info
    bankDetails: {
      type: String,
      default: "",
    },
    otherPaymentMethods: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.GiveContent ||
  mongoose.model("GiveContent", GiveContentSchema);
