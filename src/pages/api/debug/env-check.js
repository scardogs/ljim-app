/**
 * Environment Variables Check (Debug Only - Remove in Production!)
 * GET /api/debug/env-check
 */

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check which environment variables are set
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasCloudinaryCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasCloudinaryApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasCloudinaryApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    hasNextPublicCloudinaryCloudName:
      !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

    // Show actual values (safe ones only)
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "NOT SET",
    apiKeyLength: process.env.CLOUDINARY_API_KEY?.length || 0,
    apiSecretLength: process.env.CLOUDINARY_API_SECRET?.length || 0,

    // Show first few chars of API key (for debugging)
    apiKeyPrefix: process.env.CLOUDINARY_API_KEY
      ? process.env.CLOUDINARY_API_KEY.substring(0, 4) + "..."
      : "NOT SET",
  };

  return res.status(200).json({
    message: "Environment Variables Status",
    status: envStatus,
    allCloudinaryVarsSet:
      envStatus.hasCloudinaryCloudName &&
      envStatus.hasCloudinaryApiKey &&
      envStatus.hasCloudinaryApiSecret,
  });
}


