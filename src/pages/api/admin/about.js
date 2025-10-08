import connectToDatabase from "../../../lib/mongodb";
import AboutContent from "../../../../models/AboutContent";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      // Get about content (create default if doesn't exist)
      let content = await AboutContent.findOne();

      if (!content) {
        content = await AboutContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ error: "Failed to fetch about content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      // Find existing content or create new
      let content = await AboutContent.findOne();

      if (!content) {
        content = await AboutContent.create(updates);
      } else {
        content = await AboutContent.findByIdAndUpdate(content._id, updates, {
          new: true,
          runValidators: true,
        });
      }

      res.status(200).json({
        message: "About content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating about content:", error);
      res.status(500).json({ error: "Failed to update about content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// For GET requests, allow public access. For PUT, require authentication
export default async function aboutHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
