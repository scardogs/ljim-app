# Cloudinary Quick Start - Get Running in 10 Minutes

## ⚡ **Quick Setup**

### **1. Create Account (2 mins)**

1. Go to https://cloudinary.com/users/register_free
2. Sign up (FREE)
3. Copy your credentials from the dashboard

### **2. Install Packages (1 min)**

```bash
npm install cloudinary next-cloudinary
```

### **3. Add Environment Variables (1 min)**

Add to `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### **4. Update next.config.mjs (1 min)**

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

### **5. Done! (Test it)**

Files already created:

- ✅ `src/utils/cloudinary.js` - Utility functions
- ✅ `src/pages/api/cloudinary/upload.js` - Upload API
- ✅ `src/pages/api/cloudinary/delete.js` - Delete API

---

## 🎯 **Usage Examples**

### **Upload Image (Admin)**

```javascript
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "events"); // Folder: church-images/events

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    console.log("Uploaded!", data.image.url);
    // Save to MongoDB:
    // { url: data.image.url, publicId: data.image.publicId }
  }
};
```

### **Display Image**

```javascript
import { CldImage } from 'next-cloudinary';

// Simple display
<CldImage
  src="church-images/events/my-photo"
  width={800}
  height={600}
  alt="Event photo"
/>

// Auto-optimized (WebP, responsive)
<CldImage
  src="church-images/events/my-photo"
  width={800}
  height={600}
  crop="fill"
  gravity="auto"
  quality="auto"
  format="auto"
  alt="Optimized photo"
/>
```

### **Delete Image**

```javascript
const handleDelete = async (publicId) => {
  const response = await fetch("/api/cloudinary/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  const data = await response.json();
  console.log(data.success ? "Deleted!" : "Failed");
};
```

---

## 📊 **MongoDB Storage**

Store only the reference (tiny!):

```javascript
// Homepage content example
{
  heroImage: {
    url: "https://res.cloudinary.com/.../church-images/homepage/hero.jpg",
    publicId: "church-images/homepage/hero",
    width: 1920,
    height: 1080
  }
}

// Event example
{
  title: "Christmas Service",
  image: {
    url: "https://res.cloudinary.com/.../church-images/events/christmas.jpg",
    publicId: "church-images/events/christmas-2024",
    width: 1200,
    height: 800
  }
}
```

---

## 🎨 **Common Transformations**

### **Thumbnail**

```javascript
<CldImage
  src={publicId}
  width={200}
  height={200}
  crop="thumb"
  gravity="faces" // Auto-crop to faces
  alt="Thumbnail"
/>
```

### **Responsive Background**

```javascript
<CldImage
  src={publicId}
  width={1920}
  height={1080}
  crop="fill"
  gravity="auto"
  quality="auto"
  alt="Hero background"
/>
```

### **Gallery Image**

```javascript
<CldImage
  src={publicId}
  width={600}
  height={400}
  crop="fill"
  loading="lazy"
  alt="Gallery photo"
/>
```

---

## 💰 **Free Tier Limits**

✅ **25 GB** storage
✅ **25 GB** bandwidth/month
✅ **25,000** transformations/month
✅ **Unlimited** images

**Perfect for churches!** 🙏

---

## 🎯 **Folder Structure**

Organize by type:

```
church-images/
  ├── homepage/     (hero images, logos)
  ├── events/       (event photos)
  ├── staff/        (staff photos)
  ├── ministries/   (ministry photos)
  ├── shop/         (shop products)
  └── general/      (misc images)
```

---

## ✅ **Benefits**

1. ⚡ **10-50x faster** loading
2. 💰 **FREE** (25GB included)
3. 🎨 **Auto-optimization** (WebP/AVIF)
4. 📱 **Responsive** images
5. 🌍 **Global CDN**
6. 🖼️ **On-the-fly** transformations
7. 💾 **Tiny MongoDB** storage

---

## 🚀 **Ready to Use!**

All files are created. Just:

1. Add credentials to `.env.local`
2. Update `next.config.mjs`
3. Run `npm install cloudinary next-cloudinary`
4. Start using!

Check `CLOUDINARY_SETUP_GUIDE.md` for advanced features! 📖
