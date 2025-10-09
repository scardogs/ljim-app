/**
 * Cloudinary Image Upload API
 * POST /api/cloudinary/upload - Upload image to Cloudinary
 */

import { uploadImage } from "../../../utils/cloudinary";
import formidable from "formidable";
import fs from "fs";
import { verifyToken } from "../../../utils/auth";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require authentication for uploads
  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Configure formidable with proper settings
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB max
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({
        success: false,
        error: "Form parsing failed: " + err.message,
      });
    }

    try {
      const parseTime = Date.now();
      console.log("📁 Form parsed successfully");

      console.log("Received upload request:", {
        hasFields: !!fields,
        hasFiles: !!files,
        fileKeys: files ? Object.keys(files) : [],
      });

      const file = files.image?.[0];

      if (!file) {
        console.error("No file found in upload:", { files });
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      const filePath = file.filepath;
      console.log("📄 Processing file:", {
        originalName: file.originalFilename,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.mimetype,
        path: filePath,
      });

      // Determine folder based on type
      const imageType = fields.type?.[0] || "general";
      const folder = `church-images/${imageType}`;
      const tags = [imageType];

      // Add additional tags if provided
      if (fields.tags) {
        const additionalTags = JSON.parse(fields.tags[0]);
        tags.push(...additionalTags);
      }

      console.log("☁️ Starting Cloudinary upload...");
      const cloudinaryStart = Date.now();

      // Upload to Cloudinary
      const result = await uploadImage(filePath, {
        folder,
        tags,
      });

      const cloudinaryTime = ((Date.now() - cloudinaryStart) / 1000).toFixed(2);
      console.log(`✅ Cloudinary upload completed in ${cloudinaryTime}s`);

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
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Upload failed",
      });
    }
  });
}
