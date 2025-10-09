/**
 * Cloudinary Image Delete API
 * DELETE /api/cloudinary/delete - Delete image from Cloudinary
 */

import { deleteImage } from "../../../utils/cloudinary";
import { verifyToken } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require authentication
  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: "Public ID required",
      });
    }

    const result = await deleteImage(publicId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Failed to delete image",
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Delete failed",
    });
  }
}
