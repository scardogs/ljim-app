/**
 * Cloudinary Utility Functions
 * Upload, delete, and manage images on Cloudinary
 */

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};

// Debug: Log config status (without revealing secrets)
console.log("Cloudinary config status:", {
  hasCloudName: !!cloudinaryConfig.cloud_name,
  hasApiKey: !!cloudinaryConfig.api_key,
  hasApiSecret: !!cloudinaryConfig.api_secret,
  cloudName: cloudinaryConfig.cloud_name,
  apiKeyLength: cloudinaryConfig.api_key?.length,
});

// Validate configuration
if (
  !cloudinaryConfig.cloud_name ||
  !cloudinaryConfig.api_key ||
  !cloudinaryConfig.api_secret
) {
  console.error(
    "❌ Cloudinary configuration missing! Check your .env.local file:"
  );
  console.error({
    CLOUDINARY_CLOUD_NAME: cloudinaryConfig.cloud_name || "MISSING",
    CLOUDINARY_API_KEY: cloudinaryConfig.api_key
      ? `${cloudinaryConfig.api_key.substring(0, 4)}...`
      : "MISSING",
    CLOUDINARY_API_SECRET: cloudinaryConfig.api_secret ? "SET" : "MISSING",
  });
}

cloudinary.config(cloudinaryConfig);

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer, path, or base64 string
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result with URL
 */
export async function uploadImage(file, options = {}) {
  try {
    const {
      folder = "church-images",
      transformation = [],
      tags = [],
    } = options;

    console.log("Uploading to Cloudinary:", {
      folder,
      tags,
      hasFile: !!file,
    });

    const uploadStart = Date.now();

    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation,
      tags,
      resource_type: "image",
      // Auto-optimize: quality and format
      quality: "auto:good",
      fetch_format: "auto",
      // Optimize upload performance - no eager transforms for faster upload
      timeout: 120000, // 120 second timeout
      chunk_size: 6000000, // 6MB chunks for better upload performance
    });

    const uploadDuration = ((Date.now() - uploadStart) / 1000).toFixed(2);
    console.log(`⚡ Cloudinary API call took ${uploadDuration}s`);

    console.log("Upload successful:", {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("Cloudinary upload error details:", {
      message: error.message,
      error: error.error,
      statusCode: error.http_code,
      fullError: error,
    });
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload video to Cloudinary
 * @param {Buffer|string} file - File buffer or path
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result with URL
 */
export async function uploadVideo(file, options = {}) {
  try {
    const {
      folder = "church-videos",
      transformation = [],
      tags = [],
    } = options;

    console.log("Uploading video to Cloudinary:", {
      folder,
      tags,
      hasFile: !!file,
    });

    const uploadStart = Date.now();

    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation,
      tags,
      resource_type: "video",
      // Auto-optimize video
      quality: "auto:good",
      // Optimize upload performance
      timeout: 300000, // 5 minute timeout for larger videos
      chunk_size: 6000000, // 6MB chunks
    });

    const uploadDuration = ((Date.now() - uploadStart) / 1000).toFixed(2);
    console.log(`⚡ Video uploaded in ${uploadDuration}s`);

    console.log("Video upload successful:", {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      duration: result.duration,
      size: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("Cloudinary video upload error:", {
      message: error.message,
      error: error.error,
      statusCode: error.http_code,
    });
    throw new Error(`Failed to upload video: ${error.message}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      result: result.result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Get optimized image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export function getOptimizedUrl(publicId, options = {}) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop,
        quality,
        fetch_format: format,
        gravity,
      },
    ],
    secure: true,
  });
}

/**
 * List all images in a folder
 * @param {string} folder - Folder name
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Array>} List of images
 */
export async function listImages(folder = "church-images", maxResults = 100) {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: maxResults,
    });

    return result.resources.map((resource) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      size: resource.bytes,
      createdAt: resource.created_at,
    }));
  } catch (error) {
    console.error("Cloudinary list error:", error);
    throw new Error("Failed to list images");
  }
}

/**
 * Get image details
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Image details
 */
export async function getImageDetails(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at,
      tags: result.tags || [],
    };
  } catch (error) {
    console.error("Cloudinary get details error:", error);
    throw new Error("Failed to get image details");
  }
}

export default cloudinary;
