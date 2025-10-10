# Hero Video/GIF Upload - Complete Guide 🎬

## 🎉 You Can Now Upload Videos & GIFs Directly to Cloudinary!

No more pasting URLs - just upload your video or GIF files directly through the admin panel!

---

## ✅ What Was Added

### New Components:

- **VideoUpload.js** - Upload component for videos and GIFs
- **upload-video.js** - API endpoint for video uploads
- **uploadVideo()** - Utility function in cloudinary.js

### Features:

- ✅ Upload videos directly to Cloudinary
- ✅ Upload GIFs directly to Cloudinary
- ✅ Progress indicator during upload
- ✅ Live preview of uploaded media
- ✅ Tab interface (Upload vs Manual URL)
- ✅ Automatic Cloudinary optimization
- ✅ Green "Cloudinary ⚡" badge

---

## 🎯 How to Use

### Step 1: Go to Admin Panel

1. Login to admin panel
2. Go to **"Homepage Content"**
3. Click the **"Hero"** tab

### Step 2: Select Media Type

You'll see 3 radio buttons:

```
○ Image    ○ Video    ○ GIF
```

**Select:**

- **Video** - For MP4, WebM, MOV files
- **GIF** - For animated GIF files

### Step 3: Upload Your File

You'll see a tabbed interface:

#### **Tab 1: Upload to Cloudinary** (Recommended ⚡)

**For Videos:**

1. Click "Choose Video to Upload"
2. Select your video file (MP4, WebM, MOV)
3. Wait for upload (progress bar shows)
4. Video preview appears with "Cloudinary ⚡" badge
5. Done!

**For GIFs:**

1. Click "Choose GIF to Upload"
2. Select your GIF file
3. Wait for upload
4. GIF preview appears with "Cloudinary ⚡" badge
5. Done!

#### **Tab 2: Manual URL** (Alternative)

If you already have a URL:

1. Click "Manual URL" tab
2. Paste your video/GIF URL
3. Done!

### Step 4: Save Changes

- Click **"Save Changes"** at the top
- Go to homepage
- Your video/GIF plays automatically!

---

## 📊 File Limits

| Media Type | Max Size | Accepted Formats    |
| ---------- | -------- | ------------------- |
| **Video**  | 50 MB    | MP4, WebM, MOV, AVI |
| **GIF**    | 10 MB    | GIF only            |

---

## 🎬 Video Features

### Automatic Settings:

- ✅ **Autoplay** - Starts on page load
- ✅ **Muted** - No sound
- ✅ **Loop** - Plays forever
- ✅ **Mobile-optimized** - Works on phones (playsInline)
- ✅ **Grayscale filter** - For text readability
- ✅ **Cloudinary CDN** - Fast global delivery

### Cloudinary Optimization:

- Auto quality adjustment
- Format conversion (H.264, VP9)
- Adaptive bitrate streaming
- CDN caching

---

## 🎭 GIF Features

### Automatic Settings:

- ✅ **Autoplay** - Starts automatically
- ✅ **Loop** - Repeats forever
- ✅ **Optimized** - Cloudinary compression
- ✅ **Grayscale filter** - Consistent look
- ✅ **CDN delivery** - Fast loading

### Cloudinary Optimization:

- Color reduction
- Frame optimization
- File size compression
- WebP conversion when supported

---

## 💡 Best Practices

### For Videos:

**File Size:**

- ✅ Keep under 20MB if possible
- ✅ Use 10-30 second clips
- ✅ Compress before upload for faster loading

**Dimensions:**

- ✅ 1920x1080 (Full HD) - Best quality
- ✅ 1280x720 (HD) - Smaller file size
- ✅ Landscape orientation

**Content:**

- ✅ Seamless loops (start = end)
- ✅ No important audio (it's muted)
- ✅ Simple, engaging motion
- ✅ Worship, community, church building

**Format:**

- ✅ MP4 (most compatible)
- ✅ H.264 codec
- ✅ 30 FPS

### For GIFs:

**File Size:**

- ✅ Keep under 5MB
- ✅ Cloudinary will optimize

**Design:**

- ✅ Simple animations
- ✅ Limited colors (256 max)
- ✅ Subtle movements
- ✅ Loops seamlessly

**Dimensions:**

- ✅ Max 1920px width
- ✅ Smaller = faster loading

---

## 🚀 Example Workflow

### Upload a Worship Video:

1. **Prepare your video:**

   - Record or edit a 15-second worship clip
   - Export as MP4, 1920x1080
   - Keep under 20MB

2. **Admin Panel:**

   - Homepage Content → Hero tab
   - Select **"Video"** radio button
   - Click **"Upload to Cloudinary"** tab
   - Click **"Choose Video to Upload"**
   - Select your MP4 file
   - Wait ~30-60 seconds for upload
   - See video preview appear

3. **Save & Test:**
   - Click "Save Changes"
   - Visit homepage
   - Video autoplays in grayscale! 🎬

---

## 📹 Upload Flow

```
1. Select file (MP4/GIF)
        ↓
2. Validate file type & size
        ↓
3. Show upload progress
        ↓
4. Upload to Cloudinary API
        ↓
5. Cloudinary optimizes automatically
        ↓
6. Returns secure URL
        ↓
7. Preview shows in admin
        ↓
8. Save to database
        ↓
9. Displays on homepage!
```

---

## 🎨 What You'll See in Admin

### When Uploading:

```
┌────────────────────────────┐
│  Uploading video...        │
│  [████████░░] 80%          │ ← Progress bar
└────────────────────────────┘
```

### After Upload Success:

```
┌────────────────────────────┐
│  [Cloudinary ⚡]           │ ← Green badge
│                            │
│  [Video preview playing]   │
│                            │
│  [🗑️ Delete button]        │
└────────────────────────────┘

[✓] Uploaded to Cloudinary in 45.2s
```

---

## 🔍 Where Videos Are Stored

### Cloudinary Folders:

```
cloudinary://church-videos/
├── homepage/
│   └── hero/           (Hero videos/GIFs)
├── events/             (Event videos)
└── general/            (Other videos)
```

### File Naming:

- Cloudinary auto-generates unique IDs
- Original filename preserved in metadata
- Easy to find in Cloudinary dashboard

---

## 💰 Cloudinary Free Tier

### Video Storage & Bandwidth:

- ✅ 25 GB storage (shared with images)
- ✅ 25 GB bandwidth/month
- ✅ Video transformations included

### Typical Usage:

- 5 videos × 10 MB = 50 MB storage ✅
- 10,000 views × optimized = ~8 GB bandwidth ✅

**Still within free tier!** 🎉

---

## 🐛 Troubleshooting

### Upload Taking Too Long?

- Large file size (compress it first)
- Slow internet connection
- Cloudinary is optimizing (wait patiently)
- Max wait: 2-3 minutes for large files

### Upload Failed?

1. Check file size (under 50MB for video, 10MB for GIF)
2. Check file format (MP4 for video, GIF for GIF)
3. Check internet connection
4. Try again - sometimes network issues

### Video Not Playing on Homepage?

1. Check if URL was saved (go back to admin)
2. Hard refresh browser (Ctrl + Shift + R)
3. Check browser console for errors
4. Verify video URL is accessible

### GIF Not Animating?

- Make sure it's actually a GIF file
- Check if file uploaded successfully
- Try opening URL directly in browser

---

## 🎯 Quick Test

1. **Find a short video** (10-15 seconds, under 20MB)
2. **Admin Panel** → Homepage Content → Hero
3. **Select "Video"**
4. **Click "Upload to Cloudinary"** tab
5. **Choose your video**
6. **Wait for upload** (~30-60 seconds)
7. **See preview** with green badge
8. **Save Changes**
9. **Visit homepage** → Video plays! 🎉

---

## 🎉 Summary

**You can now:**

✅ **Upload videos** directly to Cloudinary (up to 50MB)  
✅ **Upload GIFs** directly to Cloudinary (up to 10MB)  
✅ **See live preview** in admin panel  
✅ **Track upload progress** with progress bar  
✅ **Auto-optimization** by Cloudinary  
✅ **Or paste URLs** manually if preferred

**No more manual URL copying - just upload and go!** 🚀

---

## 📚 File Reference

### New Files:

- `src/components/admin/VideoUpload.js` - Upload component
- `src/pages/api/cloudinary/upload-video.js` - API endpoint

### Updated Files:

- `src/utils/cloudinary.js` - Added uploadVideo() function
- `src/components/admin/HomepageContentEditor.js` - Uses VideoUpload
- `models/HomepageContent.js` - Added heroMediaType & heroVideoUrl

---

**Your hero section is now fully dynamic with video/GIF support!** 🎬✨
