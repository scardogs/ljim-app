import mongoose from "mongoose";

const RegistrationRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    approvalToken: {
      type: String,
      default: null,
    },
    approvalExpires: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RegistrationRequest ||
  mongoose.model("RegistrationRequest", RegistrationRequestSchema);
