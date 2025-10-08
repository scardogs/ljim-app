import connectToDatabase from "../../../lib/mongodb";
import HomepageContent from "../../../../models/HomepageContent";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      // Get homepage content (create default if doesn't exist)
      let content = await HomepageContent.findOne();

      if (!content) {
        content = await HomepageContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching homepage content:", error);
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      // Find existing content or create new
      let content = await HomepageContent.findOne();

      if (!content) {
        content = await HomepageContent.create(updates);
      } else {
        content = await HomepageContent.findByIdAndUpdate(
          content._id,
          updates,
          { new: true, runValidators: true }
        );
      }

      res.status(200).json({
        message: "Homepage content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating homepage content:", error);
      res.status(500).json({ error: "Failed to update homepage content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// For GET requests, allow public access. For PUT, require authentication
export default async function homepageHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
