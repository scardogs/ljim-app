import connectToDatabase from "../../../lib/mongodb";
import Song from "../../../../models/Songs";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case "GET": {
        const songs = await Song.find().sort({ dateTime: -1 }).lean();
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

// For GET requests, allow public access. For POST, require authentication
export default async function songsHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
