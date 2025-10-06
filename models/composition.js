import mongoose from "mongoose";

const CompositionSchema = new mongoose.Schema(
  {
    songName: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    url: { type: String },
    lyricsAndChords: { type: String },
    notes: { type: String },
    dateTime: { type: Date, required: true },
    SingerFname: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.Composition ||
  mongoose.model("Composition", CompositionSchema);
