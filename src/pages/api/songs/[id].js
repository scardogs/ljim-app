import connectToDatabase from "../../../lib/mongodb";
import Song from "../../../../models/Songs";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  try {
    await connectToDatabase();
    const { id } = req.query;

    switch (req.method) {
      case "GET": {
        const song = await Song.findById(id).lean();
        if (!song) return res.status(404).json({ message: "Song not found" });
        return res.status(200).json(song);
      }

      case "PUT": {
        const updatedSong = await Song.findByIdAndUpdate(id, req.body, {
          new: true,
          lean: true,
        });
        if (!updatedSong)
          return res.status(404).json({ message: "Song not found" });
        return res.status(200).json(updatedSong);
      }

      case "DELETE": {
        await Song.findByIdAndDelete(id);
        return res.status(200).json({ message: "Song deleted successfully" });
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in /api/songs/[id]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// For GET requests, allow public access. For PUT/DELETE, require authentication
export default async function songHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
