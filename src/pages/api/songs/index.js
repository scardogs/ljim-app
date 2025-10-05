import connectToDatabase from "../../../lib/mongodb";
import Song from "../../../../models/Songs";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const songs = await Song.find();
    res.status(200).json(songs);
  } else if (req.method === "POST") {
    const newSong = new Song(req.body);
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
