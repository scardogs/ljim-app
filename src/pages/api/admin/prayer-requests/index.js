import connectToDatabase from "../../../../lib/mongodb";
import PrayerRequest from "../../../../../models/PrayerRequest";
import { authMiddleware } from "../../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    // Get all prayer requests (for admin)
    try {
      const requests = await PrayerRequest.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      res.status(500).json({ error: "Failed to fetch prayer requests" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authMiddleware(handler);
