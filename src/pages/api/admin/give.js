import connectToDatabase from "../../../lib/mongodb";
import GiveContent from "../../../../models/GiveContent";
import { authMiddleware } from "../../../utils/auth";
import { deleteOldImageIfChanged } from "../../../utils/imageCleanup";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      let content = await GiveContent.findOne();

      if (!content) {
        content = await GiveContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching give content:", error);
      res.status(500).json({ error: "Failed to fetch give content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      let content = await GiveContent.findOne();

      if (content) {
        // Clean up old QR code image if changed
        if (content.qrCodeImage && updates.qrCodeImage) {
          deleteOldImageIfChanged(content.qrCodeImage, updates.qrCodeImage);
        }

        content = await GiveContent.findByIdAndUpdate(content._id, updates, {
          new: true,
          runValidators: true,
        });
      } else {
        content = await GiveContent.create(updates);
      }

      res.status(200).json({
        message: "Give content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating give content:", error);
      res.status(500).json({ error: "Failed to update give content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function giveHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
