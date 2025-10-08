import connectToDatabase from "../../../../../lib/mongodb";
import PrayerRequest from "../../../../../../models/PrayerRequest";
import { authMiddleware } from "../../../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const request = await PrayerRequest.findByIdAndDelete(id);

      if (!request) {
        return res.status(404).json({ error: "Prayer request not found" });
      }

      res.status(200).json({ message: "Prayer request deleted successfully" });
    } catch (error) {
      console.error("Error deleting prayer request:", error);
      res.status(500).json({ error: "Failed to delete prayer request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authMiddleware(handler);
