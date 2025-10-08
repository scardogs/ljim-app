import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../../../utils/auth";

// Disable body parser for this route (needed for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "images");

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    filename: (name, ext, part) => {
      // Create unique filename
      const timestamp = Date.now();
      const originalName = part.originalFilename
        .replace(/\s/g, "-")
        .toLowerCase();
      return `${timestamp}-${originalName}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the uploaded file
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    // Return the public path (relative to /public)
    const publicPath = `/images/${path.basename(uploadedFile.filepath)}`;

    res.status(200).json({
      success: true,
      path: publicPath,
      filename: path.basename(uploadedFile.filepath),
    });
  });
}

// Protect this endpoint with authentication
export default authMiddleware(handler);
