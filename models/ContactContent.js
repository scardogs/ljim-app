import mongoose from "mongoose";

const ContactContentSchema = new mongoose.Schema(
  {
    // Main Section
    title: {
      type: String,
      default: "Contact Us",
    },
    subtitle: {
      type: String,
      default: "Reach out to us with questions, prayer requests, or feedback.",
    },

    // Contact Info Section
    contactInfoTitle: {
      type: String,
      default: "Get in Touch",
    },
    email: {
      type: String,
      default: "contact@ljim.com",
    },
    phone: {
      type: String,
      default: "+1 234 567 8900",
    },
    address: {
      type: String,
      default: "",
    },

    // Social Media
    facebook: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },

    // Office Hours
    officeHours: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactContent ||
  mongoose.model("ContactContent", ContactContentSchema);
