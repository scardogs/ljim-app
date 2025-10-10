/**
 * Optimized Image Component
 * Automatically uses Cloudinary's CldImage for Cloudinary URLs
 * Falls back to Next.js Image for other URLs
 */

import React from "react";
import { CldImage } from "next-cloudinary";
import { Image as ChakraImage } from "@chakra-ui/react";

export default function OptimizedImage({
  src,
  alt = "",
  width = 800,
  height = 600,
  crop = "fill",
  gravity = "auto",
  quality = "auto",
  format = "auto",
  ...props
}) {
  // If no src, return placeholder
  if (!src) {
    return (
      <ChakraImage
        src="/images/placeholder.jpg"
        alt={alt}
        width={width}
        height={height}
        {...props}
      />
    );
  }

  // Check if it's a Cloudinary URL or public ID
  const isCloudinaryUrl =
    src.includes("res.cloudinary.com") || src.includes("cloudinary://");
  const isCloudinaryPublicId = !src.startsWith("http") && !src.startsWith("/");

  // If it's a Cloudinary image, use CldImage for optimization
  if (isCloudinaryUrl || isCloudinaryPublicId) {
    // Extract public ID from URL if needed
    let publicId = src;
    if (isCloudinaryUrl && src.includes("res.cloudinary.com")) {
      const urlParts = src.split("/upload/");
      if (urlParts.length > 1) {
        publicId = urlParts[1].replace(/^v\d+\//, ""); // Remove version prefix if present
        publicId = publicId.split(".")[0]; // Remove file extension
      }
    }

    return (
      <CldImage
        src={publicId}
        alt={alt}
        width={width}
        height={height}
        crop={crop}
        gravity={gravity}
        quality={quality}
        format={format}
        loading="lazy"
        {...props}
      />
    );
  }

  // For non-Cloudinary images, use regular Chakra Image
  return <ChakraImage src={src} alt={alt} loading="lazy" {...props} />;
}
