/**
 * Cloudinary Test Upload API (No Authentication Required)
 * POST /api/cloudinary/test-upload - Test upload to Cloudinary
 * WARNING: This is for testing only! Remove in production.
 */

import { uploadImage } from "../../../utils/cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // NOTE: No authentication for testing purposes
  // In production, use /api/cloudinary/upload with authentication

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({
        success: false,
        error: "Form parsing failed: " + err.message,
      });
    }

    try {
      console.log("Test upload - Received files:", {
        hasFiles: !!files,
        fileKeys: files ? Object.keys(files) : [],
        imageFile: files?.image,
      });

      const file = files.image?.[0];

      if (!file) {
        console.error("No file found in test upload:", { files });
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      const filePath = file.filepath;
      console.log("Test upload - Processing file:", {
        originalName: file.originalFilename,
        size: file.size,
        type: file.mimetype,
        path: filePath,
      });

      // Test folder
      const folder = "church-images/test";
      const tags = ["test"];

      console.log("Test upload - Uploading to Cloudinary...");

      // Upload to Cloudinary
      const result = await uploadImage(filePath, {
        folder,
        tags,
      });

      console.log("Test upload - Success!");

      // Clean up temp file
      fs.unlinkSync(filePath);

      return res.status(200).json({
        success: true,
        image: {
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.size,
        },
      });
    } catch (error) {
      console.error("Test upload error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Upload failed",
        details: error.toString(),
      });
    }
  });
}
