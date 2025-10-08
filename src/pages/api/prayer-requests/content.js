import connectToDatabase from "../../../lib/mongodb";
import PrayerRequestsContent from "../../../../models/PrayerRequestsContent";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      let content = await PrayerRequestsContent.findOne();

      if (!content) {
        content = await PrayerRequestsContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching prayer requests content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      let content = await PrayerRequestsContent.findOne();

      if (!content) {
        content = await PrayerRequestsContent.create(updates);
      } else {
        content = await PrayerRequestsContent.findByIdAndUpdate(
          content._id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        );
      }

      res.status(200).json({
        message: "Content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function contentHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
