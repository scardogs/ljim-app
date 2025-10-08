import mongoose from "mongoose";

const PrayerRequestsContentSchema = new mongoose.Schema(
  {
    // Main Section
    title: {
      type: String,
      default: "Prayer Requests",
    },
    subtitle: {
      type: String,
      default: "Share your prayer needs with our community.",
    },
    description: {
      type: String,
      default:
        "We believe in the power of prayer. Submit your prayer request and our community will lift you up in prayer.",
    },

    // Form Section
    formTitle: {
      type: String,
      default: "Submit a Prayer Request",
    },
    submitButtonText: {
      type: String,
      default: "Submit Prayer Request",
    },
    successMessage: {
      type: String,
      default:
        "Thank you! Your prayer request has been received and will be reviewed by our team.",
    },

    // Prayer Wall Section
    wallTitle: {
      type: String,
      default: "Prayer Wall",
    },
    wallDescription: {
      type: String,
      default: "Join us in prayer for these requests from our community.",
    },
    prayButtonText: {
      type: String,
      default: "I Prayed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PrayerRequestsContent ||
  mongoose.model("PrayerRequestsContent", PrayerRequestsContentSchema);
