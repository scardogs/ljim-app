/**
 * API Route: Upload Video to Cloudinary
 * Handles video file uploads with authentication
 */

import { IncomingForm } from "formidable";
import fs from "fs";
import { uploadVideo } from "../../../utils/cloudinary";
import { verifyToken } from "../../../utils/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Parse form data
    const form = new IncomingForm({
      maxFileSize: 50 * 1024 * 1024, // 50MB max
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const videoFile = files.video?.[0];
    if (!videoFile) {
      return res.status(400).json({ error: "No video file provided" });
    }

    // Get upload options
    const imageType = fields.type?.[0] || "general";
    const folder = `church-videos/${imageType}`;

    console.log("Uploading video to Cloudinary:", {
      folder,
      fileName: videoFile.originalFilename,
      fileSize: `${(videoFile.size / 1024 / 1024).toFixed(2)} MB`,
    });

    // Upload to Cloudinary using utility function
    const result = await uploadVideo(videoFile.filepath, {
      folder,
      tags: [imageType],
    });

    // Clean up temp file
    fs.unlinkSync(videoFile.filepath);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({
      error: error.message || "Failed to upload video",
    });
  }
}
