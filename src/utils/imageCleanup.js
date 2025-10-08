import fs from "fs";
import path from "path";

/**
 * Delete an image from the public/images directory
 * @param {string} imagePath - Path to the image (e.g., "/images/product.jpg")
 * @returns {boolean} - True if deleted successfully, false otherwise
 */
export function deleteImageFile(imagePath) {
  try {
    // Only process if imagePath is provided and starts with /images/
    if (!imagePath || !imagePath.startsWith("/images/")) {
      return false;
    }

    // Construct absolute path to the file
    const fileName = path.basename(imagePath);
    const filePath = path.join(process.cwd(), "public", "images", fileName);

    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted image: ${fileName}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

/**
 * Compare old and new image paths and delete the old one if different
 * @param {string} oldImagePath - Previous image path
 * @param {string} newImagePath - New image path
 */
export function deleteOldImageIfChanged(oldImagePath, newImagePath) {
  if (
    oldImagePath &&
    newImagePath &&
    oldImagePath !== newImagePath &&
    oldImagePath.startsWith("/images/")
  ) {
    deleteImageFile(oldImagePath);
  }
}
