import connectToDatabase from "../../../lib/mongodb";
import NavbarContent from "../../../../models/NavbarContent";
import { authMiddleware } from "../../../utils/auth";
import { deleteOldImageIfChanged } from "../../../utils/imageCleanup";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      let content = await NavbarContent.findOne();

      if (!content) {
        content = await NavbarContent.create({});
      }

      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching navbar content:", error);
      res.status(500).json({ error: "Failed to fetch navbar content" });
    }
  } else if (req.method === "PUT") {
    try {
      const updates = req.body;

      let content = await NavbarContent.findOne();

      if (content) {
        // Clean up old logo if changed
        if (content.logo && updates.logo) {
          deleteOldImageIfChanged(content.logo, updates.logo);
        }

        content = await NavbarContent.findByIdAndUpdate(content._id, updates, {
          new: true,
          runValidators: true,
        });
      } else {
        content = await NavbarContent.create(updates);
      }

      res.status(200).json({
        message: "Navbar content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating navbar content:", error);
      res.status(500).json({ error: "Failed to update navbar content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default async function navbarHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
