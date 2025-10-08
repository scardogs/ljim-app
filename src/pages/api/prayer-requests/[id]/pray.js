import connectToDatabase from "../../../../lib/mongodb";
import PrayerRequest from "../../../../../models/PrayerRequest";

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === "POST") {
    try {
      const request = await PrayerRequest.findByIdAndUpdate(
        id,
        { $inc: { prayerCount: 1 } },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ error: "Prayer request not found" });
      }

      res.status(200).json({
        message: "Prayer recorded",
        prayerCount: request.prayerCount,
      });
    } catch (error) {
      console.error("Error recording prayer:", error);
      res.status(500).json({ error: "Failed to record prayer" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
