# 📸 Image Upload Guide

## ✅ What Was Added

I've implemented a complete image upload system for your admin module!

### New Features:

1. **Upload API Endpoint** (`/api/admin/upload-image`)

   - Accepts image uploads up to 5MB
   - Saves images to `public/images/` folder
   - Returns the image path for database storage
   - Protected with JWT authentication

2. **ImageUpload Component** (`src/components/admin/ImageUpload.js`)

   - Visual image preview
   - Drag-and-drop or click to upload
   - Manual path input (for existing images)
   - File validation (type and size)
   - Progress indicator
   - Success/error notifications

3. **Integrated in Admin Editor**
   - Hero background image uploader
   - Singer photo uploaders

## 🎯 How to Use

### In Admin Dashboard:

1. **Navigate to Home Content** section
2. **Find image fields** (Hero Image, Singer Photos, etc.)
3. You'll see:
   ```
   ┌─────────────────────────────────────┐
   │ [Image Preview if exists]           │
   ├─────────────────────────────────────┤
   │ /images/current-image.jpg    ✓      │
   ├─────────────────────────────────────┤
   │ [📎 Upload New Image] (Max 5MB...)  │
   └─────────────────────────────────────┘
   ```

### Upload Methods:

#### Method 1: Upload New Image

1. Click **"Upload New Image"** button
2. Select image from your computer
3. Image uploads automatically
4. Preview appears instantly
5. Path is saved to the field

#### Method 2: Manual Path Entry

1. Type image path directly in the input field
2. Example: `/images/my-photo.jpg`
3. Preview will load automatically

### Supported Formats:

- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ SVG

### File Size Limit:

- Maximum: **5MB** per image

## 📁 Where Images Are Stored

Uploaded images are saved to:

```
public/
  └── images/
      └── [timestamp]-[filename].jpg
```

Example: `public/images/1234567890-joshua-photo.jpg`

The path saved in database: `/images/1234567890-joshua-photo.jpg`

## 🎨 Features

### Image Preview

- Shows thumbnail of current image
- Click ❌ to remove and clear field
- Updates in real-time

### Validation

- ✅ Only image files allowed
- ✅ 5MB size limit enforced
- ✅ Automatic file renaming (prevents conflicts)
- ✅ Timestamp added to filename

### User Experience

- Toast notifications for success/errors
- Loading spinner during upload
- Preview before saving
- Green checkmark when saved

## 🔧 Technical Details

### Upload Flow:

```
1. User selects file
   ↓
2. File validated (type & size)
   ↓
3. Preview generated (browser)
   ↓
4. Upload to /api/admin/upload-image
   ↓
5. Server saves to public/images/
   ↓
6. Returns path: /images/filename.jpg
   ↓
7. Path saved to content field
   ↓
8. Click "Save Changes" to persist
```

### Security:

- 🔒 JWT authentication required
- 🔒 File type validation
- 🔒 File size limits
- 🔒 Secure filename generation

## 📝 Example Usage

### Uploading a Hero Image:

1. Go to **Hero Section** in admin
2. Click **"Upload New Image"**
3. Select `church-building.jpg`
4. Image uploads → Path becomes `/images/1234567890-church-building.jpg`
5. Preview shows the image
6. Click **"Save Changes"** at bottom
7. Visit homepage → New hero image appears!

### Uploading Singer Photos:

1. Go to **Singers Section** in admin
2. Expand a singer card
3. Click **"Upload New Image"** under their photo
4. Select singer's photo
5. Image uploads and preview appears
6. Click **"Save Changes"**
7. Singer's photo updates on homepage!

## 🐛 Troubleshooting

### Upload Failed?

**"File too large"**

- Reduce image size to under 5MB
- Use image compression tools (TinyPNG, etc.)

**"Invalid file type"**

- Ensure file is an image (.jpg, .png, .gif, etc.)
- Rename file to include proper extension

**"Upload failed"**

- Check you're logged in (token valid)
- Check server logs for errors
- Ensure `public/images/` folder exists

### Image Not Showing?

**After upload:**

- Hard refresh browser (Ctrl+Shift+R)
- Check path in database is correct
- Verify image exists in `public/images/`

**Wrong image path:**

- Update path manually in input field
- Re-upload the image

## 🚀 Alternative: Third-Party Services

If you prefer cloud storage, you can use:

### Option 1: Cloudinary (Recommended)

```bash
npm install cloudinary
```

- Free tier: 25GB storage, 25GB bandwidth
- Image optimization & transformations
- CDN delivery

### Option 2: ImgBB

- Free image hosting
- Simple API
- No account needed

### Option 3: AWS S3

- Highly scalable
- Pay as you go
- Professional solution

**Would you like me to implement any of these alternatives?**

## 📊 Storage Considerations

### Current Setup (Local Storage):

- ✅ Simple & fast
- ✅ No external dependencies
- ✅ No cost
- ⚠️ Images stored with your code
- ⚠️ Not ideal for production at scale

### Recommendations:

- **Development**: Use local storage (current setup)
- **Production**: Consider cloud storage (Cloudinary/S3)

## 🎯 Next Steps

1. ✅ Upload feature is ready to use!
2. Test uploading images in admin dashboard
3. Verify images appear on homepage
4. Consider cloud storage for production

## 💡 Tips

- **Optimize images** before uploading (compress, resize)
- **Use descriptive filenames** (e.g., "joshua-worship-leader.jpg")
- **Consistent dimensions** for better UI (e.g., all singers 800x800px)
- **WebP format** for better compression (if supported)
- **Backup images** regularly

---

**Ready to upload images! 📸**

Visit your admin dashboard and try uploading a new hero image or singer photo!
