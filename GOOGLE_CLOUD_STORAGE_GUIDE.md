# Google Cloud Storage for Fast Image Delivery

## 🎯 **Why Google Cloud Storage > Google Drive**

### **Google Drive (Slow)**

- ❌ Not meant for web hosting
- ❌ Requires authentication redirects
- ❌ No CDN
- ❌ Slower loading

### **Google Cloud Storage (Fast)**

- ✅ Built for web hosting
- ✅ Direct public URLs
- ✅ Global CDN included
- ✅ Lightning fast delivery
- ✅ FREE 5GB storage

---

## 🔧 **Setup (5 Minutes)**

### **Step 1: Create Storage Bucket**

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Navigate to **Cloud Storage** → **Buckets**
3. Click **Create Bucket**
4. Bucket name: `ljim-church-images` (must be globally unique)
5. Location: Choose region close to your users
6. Storage class: **Standard**
7. Access control: **Fine-grained**
8. Click **Create**

### **Step 2: Make Bucket Public**

1. Click on your bucket
2. Go to **Permissions** tab
3. Click **Grant Access**
4. New principals: `allUsers`
5. Role: **Storage Object Viewer**
6. Click **Save**

### **Step 3: Get Service Account Access**

You already have a service account from Google Calendar setup!

1. Go to **IAM & Admin** → **Service Accounts**
2. Select your existing service account: `ljim-calendar-service@...`
3. Go to **Permissions** tab
4. Add role: **Storage Object Admin**

---

## 📝 **Environment Variables**

Add to `.env.local`:

```env
# Google Cloud Storage
GOOGLE_CLOUD_STORAGE_BUCKET=ljim-church-images
# Service account email and key already set from Calendar API
```

---

## 💻 **Implementation**

### **Utility File**

Create `src/utils/googleCloudStorage.js`:

```javascript
import { Storage } from "@google-cloud/storage";

let storage;

function getStorageClient() {
  if (!storage) {
    storage = new Storage({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });
  }
  return storage;
}

export async function uploadImage(file, filename) {
  const storage = getStorageClient();
  const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
  const blob = bucket.file(`images/${filename}`);

  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
      cacheControl: "public, max-age=31536000", // Cache for 1 year
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", reject);
    blobStream.on("finish", () => {
      // Make file public
      blob.makePublic().then(() => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve({
          url: publicUrl,
          filename: blob.name,
        });
      });
    });
    blobStream.end(file.buffer);
  });
}

export async function deleteImage(filename) {
  const storage = getStorageClient();
  const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
  await bucket.file(filename).delete();
}

export async function listImages(prefix = "images/") {
  const storage = getStorageClient();
  const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
  const [files] = await bucket.getFiles({ prefix });

  return files.map((file) => ({
    name: file.name,
    url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    size: file.metadata.size,
    created: file.metadata.timeCreated,
  }));
}
```

### **API Route**

Create `src/pages/api/upload-image.js`:

```javascript
import { uploadImage } from "../../utils/googleCloudStorage";
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

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const file = files.image[0];
    const buffer = fs.readFileSync(file.filepath);

    const filename = `${Date.now()}-${file.originalFilename}`;

    try {
      const result = await uploadImage(
        {
          buffer,
          mimetype: file.mimetype,
        },
        filename
      );

      res.status(200).json({
        success: true,
        url: result.url,
        filename: result.filename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
```

### **Frontend Usage**

```javascript
// Upload image
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    console.log("Image URL:", data.url);
    // Fast CDN URL: https://storage.googleapis.com/ljim-church-images/images/123-photo.jpg
  }
};

// Display with Next.js Image
import Image from "next/image";

<Image
  src="https://storage.googleapis.com/ljim-church-images/images/photo.jpg"
  width={800}
  height={600}
  alt="Church event"
  priority // For above-the-fold images
/>;
```

---

## 🚀 **Performance Benefits**

### **Before (Google Drive)**

```
Image Request → Google Drive → Auth Check → Redirect → Download
Time: 2-5 seconds 🐌
```

### **After (Cloud Storage)**

```
Image Request → Google CDN → Direct Delivery
Time: 100-300ms ⚡
```

**10-50x faster!**

---

## 💰 **Cost Breakdown**

### **FREE Tier**

- Storage: First 5 GB **FREE**
- Network: First 1 GB/month **FREE**
- Operations: 5,000 Class A, 50,000 Class B **FREE**

### **Typical Church Usage**

- 500 images × 2MB = 1 GB storage = **FREE**
- 10,000 views/month × 2MB = 20 GB bandwidth = ~$2/month
- **Total: $0-2/month** (vs $20-50 with dedicated hosting)

### **If You Exceed Free Tier**

- Storage: $0.020/GB/month
- Bandwidth: $0.12/GB (after 1GB free)

---

## 🎨 **Image Optimization**

### **Option 1: Optimize Before Upload**

```javascript
import sharp from "sharp";

// Resize and compress
const optimized = await sharp(file.buffer)
  .resize(1200, 800, { fit: "inside" })
  .webp({ quality: 80 })
  .toBuffer();

await uploadImage(optimized, filename);
```

### **Option 2: Next.js Automatic Optimization**

```javascript
// next.config.mjs
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
};

// Next.js handles optimization automatically
<Image src={cloudStorageUrl} ... />
```

---

## 📋 **Updated Architecture**

```javascript
// MongoDB - Store only references
{
  imageId: "123-event-photo.jpg",
  imageUrl: "https://storage.googleapis.com/ljim-church-images/images/123-event-photo.jpg",
  imageType: "event",
  uploadedAt: Date,
  size: 2048576 // bytes
}

// Benefits:
// - MongoDB: ~100 bytes per image (tiny!)
// - Image: Fast CDN delivery
// - No slow redirects
// - Global edge caching
```

---

## ✅ **Best Practices**

1. **Naming Convention**

```javascript
// Organized structure
images / events / 2024 - christmas.jpg;
images / staff / pastor - john.jpg;
images / ministries / worship - team.jpg;
```

2. **Cache Headers**

```javascript
metadata: {
  cacheControl: 'public, max-age=31536000', // 1 year
}
```

3. **WebP Format**

```javascript
// Modern browsers, smaller files
await sharp(buffer).webp({ quality: 85 }).toBuffer();
```

4. **Lazy Loading**

```javascript
<Image src={url} loading="lazy" />
```

---

## 🔄 **Migration from Current Setup**

If you already have images:

```javascript
// One-time migration script
async function migrateImages() {
  const images = await db.collection("images").find().toArray();

  for (const img of images) {
    // Download from current location
    const response = await fetch(img.currentUrl);
    const buffer = await response.buffer();

    // Upload to Cloud Storage
    const result = await uploadImage(
      {
        buffer,
        mimetype: "image/jpeg",
      },
      img.filename
    );

    // Update MongoDB with new URL
    await db.collection("images").updateOne(
      { _id: img._id },
      {
        $set: {
          cloudStorageUrl: result.url,
          migrated: true,
        },
      }
    );
  }
}
```

---

## 🎉 **Summary**

**For Your Church Website:**

1. **Use Google Cloud Storage** for all display images

   - Event photos
   - Staff photos
   - Ministry images
   - Website graphics

2. **Use Google Drive** for downloads only

   - PDF bulletins
   - Documents
   - Forms to fill out

3. **Use YouTube** for videos
   - Sermons
   - Event recordings

**Result:**

- ⚡ Fast image loading (10-50x faster)
- 💰 Still free/cheap (< $2/month)
- 🌍 Global CDN
- 📱 Perfect for mobile

Perfect solution! 🙏



