import connectToDatabase from "../../../lib/mongodb";
import Singer from "../../../../models/Singers";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    const singer = await Singer.findById(id);
    if (!singer) return res.status(404).json({ error: "Singer not found" });
    res.status(200).json(singer);
  } else if (req.method === "PUT") {
    const updatedSinger = await Singer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedSinger);
  } else if (req.method === "DELETE") {
    await Singer.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
