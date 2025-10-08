import connectToDatabase from "../../../lib/mongodb";
import PrayerRequest from "../../../../models/PrayerRequest";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    // Get all approved public prayer requests
    try {
      const requests = await PrayerRequest.find({
        isApproved: true,
        isPublic: true,
      }).sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      res.status(500).json({ error: "Failed to fetch prayer requests" });
    }
  } else if (req.method === "POST") {
    // Submit a new prayer request
    try {
      const { name, email, request, isPublic } = req.body;

      if (!name || !request) {
        return res.status(400).json({ error: "Name and request are required" });
      }

      const newRequest = await PrayerRequest.create({
        name,
        email,
        request,
        isPublic,
        isApproved: false, // Requires admin approval
      });

      res.status(201).json({
        message: "Prayer request submitted successfully",
        request: newRequest,
      });
    } catch (error) {
      console.error("Error submitting prayer request:", error);
      res.status(500).json({ error: "Failed to submit prayer request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
