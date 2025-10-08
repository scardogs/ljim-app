import fs from "fs";
import path from "path";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: "Image path is required" });
    }

    // Security: Only allow deleting from /images/ directory
    if (!imagePath.startsWith("/images/")) {
      return res.status(400).json({ error: "Invalid image path" });
    }

    // Construct absolute path to the file
    const fileName = path.basename(imagePath);
    const filePath = path.join(process.cwd(), "public", "images", fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      deletedPath: imagePath,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}

// Protect this endpoint with authentication
export default authMiddleware(handler);
