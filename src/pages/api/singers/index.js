import connectToDatabase from "../../../lib/mongodb";
import Singer from "../../../../models/Singers";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const singers = await Singer.find();
    res.status(200).json(singers);
  } else if (req.method === "POST") {
    const newSinger = new Singer(req.body);
    const savedSinger = await newSinger.save();
    res.status(201).json(savedSinger);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
