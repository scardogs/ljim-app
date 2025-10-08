import connectToDatabase from "../../../lib/mongodb";
import ContactContent from "../../../../models/ContactContent";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      let content = await ContactContent.findOne();

      if (!content) {
        content = await ContactContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching contact content:", error);
      res.status(500).json({ error: "Failed to fetch contact content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      let content = await ContactContent.findOne();

      if (!content) {
        content = await ContactContent.create(updates);
      } else {
        content = await ContactContent.findByIdAndUpdate(content._id, updates, {
          new: true,
          runValidators: true,
        });
      }

      res.status(200).json({
        message: "Contact content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating contact content:", error);
      res.status(500).json({ error: "Failed to update contact content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function contactHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
