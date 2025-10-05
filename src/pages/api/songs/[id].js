import connectToDatabase from "../../../lib/mongodb";
import Song from "../../../../models/Songs";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    const song = await Song.findById(id);
    res.status(200).json(song);
  } else if (req.method === "PUT") {
    const updatedSong = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedSong);
  } else if (req.method === "DELETE") {
    await Song.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
