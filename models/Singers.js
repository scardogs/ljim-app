import mongoose from "mongoose";

const SingerSchema = new mongoose.Schema(
  {
    Fname: { type: String },
    Mname: { type: String },
    Lname: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.Singer || mongoose.model("Singer", SingerSchema);
