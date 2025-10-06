import connectToDatabase from "../../../lib/mongodb";
import Song from "../../../../models/Songs";

// 🚀 Use a persistent DB connection and lean queries for performance
export default async function handler(req, res) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case "GET": {
        // ✅ use .lean() to return plain JS objects (no Mongoose overhead)
        const songs = await Song.find().lean();
        return res.status(200).json(songs);
      }

      case "POST": {
        const newSong = new Song(req.body);
        const savedSong = await newSong.save();
        return res.status(201).json(savedSong);
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in /api/songs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
