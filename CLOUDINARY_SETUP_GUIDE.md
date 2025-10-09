# Cloudinary Integration - Complete Setup Guide

## 🎯 **Why Cloudinary is Perfect for Your Church**

### **Benefits Over Other Solutions**

- ✅ **25 GB FREE** storage
- ✅ **25 GB FREE** bandwidth per month
- ✅ **Automatic image optimization** (WebP, AVIF)
- ✅ **On-the-fly transformations** (resize, crop, filters)
- ✅ **Global CDN** (super fast delivery)
- ✅ **AI-powered features** (auto-crop, background removal)
- ✅ **Video support** (if needed later)
- ✅ **Easy integration** with Next.js

---

## 🚀 **Setup (10 Minutes)**

### **Step 1: Create Cloudinary Account**

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email (FREE account)
3. Verify your email
4. You'll be redirected to the dashboard

### **Step 2: Get Your Credentials**

On the Cloudinary Dashboard, you'll see:

```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

**Save these!** You'll need them.

### **Step 3: Configure Environment Variables**

Add to your `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# Public (for frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### **Step 4: Install Cloudinary SDK**

```bash
npm install cloudinary next-cloudinary
```

---

## 💻 **Implementation**

### **1. Cloudinary Utility** (`src/utils/cloudinary.js`)

Create this file:

```javascript
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
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

    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation,
      tags,
      resource_type: "image",
      // Auto-optimize: quality and format
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
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
  } = options;

  return cloudinary.url(publicId, {
    transformation: [{ width, height, crop, quality, fetch_format: format }],
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

export default cloudinary;
```

---

### **2. Upload API Route** (`src/pages/api/upload-image.js`)

```javascript
import { uploadImage } from "../../utils/cloudinary";
import formidable from "formidable";
import fs from "fs";
import { authMiddleware } from "../../utils/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require authentication
  const authResult = authMiddleware(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }

    try {
      const file = files.image[0];
      const filePath = file.filepath;

      // Determine folder based on type
      const imageType = fields.type?.[0] || "general";
      const folder = `church-images/${imageType}`;

      // Upload to Cloudinary
      const result = await uploadImage(filePath, {
        folder,
        tags: [imageType],
      });

      // Clean up temp file
      fs.unlinkSync(filePath);

      return res.status(200).json({
        success: true,
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
}
```

---

### **3. Delete API Route** (`src/pages/api/delete-image.js`)

```javascript
import { deleteImage } from "../../utils/cloudinary";
import { authMiddleware } from "../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require authentication
  const authResult = authMiddleware(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: "Public ID required" });
    }

    const result = await deleteImage(publicId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
```

---

### **4. Next.js Config** (Update `next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## 🎨 **Frontend Usage Examples**

### **Upload Image Component**

```javascript
import { useState } from "react";
import { Button, Input, VStack, Image, useToast } from "@chakra-ui/react";

export default function ImageUploader({
  onUploadSuccess,
  imageType = "events",
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const toast = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", imageType);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Image uploaded!",
          status: "success",
          duration: 3000,
        });

        // Callback with image data
        onUploadSuccess({
          url: data.url,
          publicId: data.publicId,
          width: data.width,
          height: data.height,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <VStack spacing={4}>
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {preview && (
        <Image src={preview} alt="Preview" maxW="300px" borderRadius="md" />
      )}

      {uploading && <p>Uploading...</p>}
    </VStack>
  );
}
```

### **Display Optimized Images**

```javascript
import Image from "next/image";
import { CldImage } from "next-cloudinary";

// Option 1: Using Next.js Image (simple)
function SimpleImage({ url }) {
  return (
    <Image
      src={url}
      alt="Church event"
      width={800}
      height={600}
      style={{ objectFit: "cover" }}
    />
  );
}

// Option 2: Using next-cloudinary (advanced)
function OptimizedImage({ publicId }) {
  return (
    <CldImage
      src={publicId}
      width={800}
      height={600}
      crop="fill"
      gravity="auto"
      alt="Church event"
      sizes="(max-width: 768px) 100vw, 800px"
    />
  );
}

// Option 3: Responsive with transformations
function ResponsiveImage({ publicId }) {
  return (
    <CldImage
      src={publicId}
      width={1200}
      height={800}
      crop="fill"
      gravity="auto"
      quality="auto"
      format="auto"
      alt="Church event"
      responsive
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
    />
  );
}
```

---

## 🎯 **Advanced Features**

### **1. Auto-Crop to Faces**

```javascript
// Automatically crop to focus on faces (great for staff photos)
<CldImage
  src={publicId}
  width={400}
  height={400}
  crop="thumb"
  gravity="faces"
  alt="Staff member"
/>
```

### **2. Image Effects**

```javascript
// Add effects like blur, grayscale, etc.
<CldImage
  src={publicId}
  width={800}
  height={600}
  effects={[
    { improve: true }, // Auto-enhance
    { sharpen: 50 }, // Sharpen
  ]}
  alt="Enhanced image"
/>
```

### **3. Lazy Loading**

```javascript
<CldImage
  src={publicId}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  alt="Lazy loaded image"
/>
```

### **4. Watermark/Logo Overlay**

```javascript
// Add church logo watermark
<CldImage
  src={publicId}
  width={800}
  height={600}
  overlays={[
    {
      publicId: "church-logo",
      position: { gravity: "south_east", x: 10, y: 10 },
      width: 100,
    },
  ]}
  alt="Image with logo"
/>
```

---

## 📊 **Organize Images by Folder**

```javascript
// Upload to specific folders
await uploadImage(file, {
  folder: "church-images/events/2024",
  tags: ["christmas", "2024", "event"],
});

await uploadImage(file, {
  folder: "church-images/staff",
  tags: ["staff", "leadership"],
});

await uploadImage(file, {
  folder: "church-images/ministries/worship",
  tags: ["worship", "ministry"],
});
```

---

## 💰 **Free Tier Limits**

### **What You Get FREE:**

- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ 25,000 transformations per month
- ✅ Unlimited images
- ✅ All optimization features
- ✅ CDN delivery worldwide

### **Typical Church Usage:**

- 1,000 images × 2MB = 2 GB storage ✅ FREE
- 50,000 page views × 2MB = 100 GB bandwidth = Would exceed after 25GB
- Solution: Use transformations to reduce sizes

### **If You Exceed (Unlikely):**

- $0.096 per GB bandwidth
- $0.10 per GB storage per month

---

## 🚀 **Performance Benefits**

### **Automatic Optimizations:**

```javascript
// Single line gets you:
// - WebP/AVIF format (70% smaller)
// - Auto quality adjustment
// - Responsive sizing
// - Lazy loading
// - CDN delivery

<CldImage
  src={publicId}
  width={800}
  height={600}
  quality="auto"
  format="auto"
  alt="Auto-optimized"
/>
```

### **Load Time Comparison:**

- Original JPEG (5 MB): **3-5 seconds**
- Cloudinary WebP (400 KB): **200-500ms** ⚡
- **90% faster!**

---

## 📋 **MongoDB Schema**

Update your image storage:

```javascript
// Before (storing full image)
{
  imageData: Buffer, // 5 MB per image ❌
  mimetype: String,
}

// After (Cloudinary reference)
{
  cloudinaryPublicId: "church-images/events/123-christmas",
  cloudinaryUrl: "https://res.cloudinary.com/your-cloud/...",
  width: 1920,
  height: 1080,
  format: "jpg",
  size: 512000, // bytes
  imageType: "event",
  folder: "church-images/events",
  uploadedAt: Date,
}
// Only ~200 bytes per image! ✅
```

---

## 🔄 **Migration from Current Images**

```javascript
// Migrate existing images to Cloudinary
import fs from "fs";
import path from "path";

async function migrateImages() {
  const publicDir = path.join(process.cwd(), "public/images");
  const files = fs.readdirSync(publicDir);

  for (const file of files) {
    const filePath = path.join(publicDir, file);

    try {
      const result = await uploadImage(filePath, {
        folder: "church-images/migrated",
        tags: ["migrated"],
      });

      console.log(`✅ Migrated: ${file} -> ${result.url}`);

      // Optionally delete old file
      // fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`❌ Failed: ${file}`, error);
    }
  }
}
```

---

## ✅ **Best Practices**

### **1. Use Folders for Organization**

```
church-images/
  ├── events/
  │   ├── 2024/
  │   └── 2025/
  ├── staff/
  ├── ministries/
  │   ├── worship/
  │   └── youth/
  └── general/
```

### **2. Add Descriptive Tags**

```javascript
tags: ["christmas-2024", "event", "worship"];
```

### **3. Use Transformations**

```javascript
// Don't store multiple sizes
// Generate on-the-fly:
- Thumbnail: width=200, height=200, crop="thumb"
- Medium: width=800, height=600
- Large: width=1920, height=1080
```

### **4. Lazy Load Below the Fold**

```javascript
<CldImage
  src={publicId}
  width={800}
  height={600}
  loading="lazy" // Only for images below the fold
  alt="Event photo"
/>
```

---

## 🎉 **Summary**

**Setup Checklist:**

- [ ] Create Cloudinary account
- [ ] Get credentials (Cloud Name, API Key, Secret)
- [ ] Add to `.env.local`
- [ ] Install `npm install cloudinary next-cloudinary`
- [ ] Create utility file
- [ ] Create API routes
- [ ] Update next.config.mjs
- [ ] Test upload and display

**What You Get:**

- ⚡ **10-50x faster** image loading
- 💰 **FREE** for 25 GB storage + bandwidth
- 🎨 **Automatic optimization** (WebP, AVIF)
- 🌍 **Global CDN** delivery
- 🖼️ **On-the-fly transformations**
- 📱 **Responsive images** automatically
- 🤖 **AI features** (auto-crop, etc.)

**Perfect for a church website!** 🙏✨
