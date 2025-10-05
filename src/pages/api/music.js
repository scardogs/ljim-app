import {
  getMusic,
  addMusic,
  updateMusic,
  deleteMusic,
} from "../../lib/googleSheets.js";

export default async function handler(req, res) {
  console.log(`API ${req.method} /api/music called`);

  try {
    switch (req.method) {
      case "GET":
        console.log("Fetching music data...");
        const music = await getMusic();
        console.log("Music data fetched successfully:", music);
        res.status(200).json(music);
        break;
      case "POST":
        console.log("Adding new music:", req.body);
        await addMusic(req.body); // req.body should be array: [name, artist, album, genre, lyrics, url, notes]
        res.status(201).json({ message: "Added successfully" });
        break;
      case "PUT":
        console.log("Updating music:", req.body);
        await updateMusic(req.body.rowIndex, req.body.rowData);
        res.status(200).json({ message: "Updated successfully" });
        break;
      case "DELETE":
        console.log("Deleting music:", req.body);
        await deleteMusic(req.body.rowIndex);
        res.status(200).json({ message: "Deleted successfully" });
        break;
      default:
        res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
