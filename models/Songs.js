import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
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
export default mongoose.models.Song || mongoose.model("Song", SongSchema);
