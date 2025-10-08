import mongoose from "mongoose";

const NavbarContentSchema = new mongoose.Schema(
  {
    // Logo Settings
    logo: {
      type: String,
      default: "", // Path to logo image
    },
    showLogo: {
      type: Boolean,
      default: false, // Whether to display the logo
    },
    logoWidth: {
      type: Number,
      default: 40, // Logo width in pixels
    },

    // Text Settings
    brandText: {
      type: String,
      default: "LJIM",
    },
    fontSize: {
      type: String,
      default: "2xl", // Chakra UI font size
    },
  },
  { timestamps: true }
);

export default mongoose.models.NavbarContent ||
  mongoose.model("NavbarContent", NavbarContentSchema);
