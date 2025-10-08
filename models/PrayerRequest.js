import mongoose from "mongoose";

const PrayerRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    request: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // User chooses if it's public
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval required
    },
    isPrayed: {
      type: Boolean,
      default: false, // Mark as prayed
    },
    prayerCount: {
      type: Number,
      default: 0, // Count how many people prayed
    },
  },
  { timestamps: true }
);

export default mongoose.models.PrayerRequest ||
  mongoose.model("PrayerRequest", PrayerRequestSchema);
