import connectToDatabase from "../../../lib/mongodb";
import HomepageContent from "../../../../models/HomepageContent";
import { authMiddleware } from "../../../utils/auth";
import { deleteOldImageIfChanged } from "../../../utils/imageCleanup";

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

      if (content) {
        // Clean up old images if they were changed
        if (content.heroImage && updates.heroImage) {
          deleteOldImageIfChanged(content.heroImage, updates.heroImage);
        }

        // Clean up ministry images if changed
        const oldMinistries = content.ministries || [];
        const newMinistries = updates.ministries || [];

        oldMinistries.forEach((oldMinistry, index) => {
          const newMinistry = newMinistries[index];
          if (newMinistry && oldMinistry.image && newMinistry.image) {
            deleteOldImageIfChanged(oldMinistry.image, newMinistry.image);
          }
        });

        content = await HomepageContent.findByIdAndUpdate(
          content._id,
          updates,
          { new: true, runValidators: true }
        );
      } else {
        content = await HomepageContent.create(updates);
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
