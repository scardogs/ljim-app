# Hero Section - Video & GIF Support 🎬

## 🎉 What Was Added

Your hero section now supports **3 types of backgrounds**:

- 🖼️ **Images** - Static images (Cloudinary-optimized)
- 🎬 **Videos** - Autoplay videos with no sound
- 🎭 **GIFs** - Animated GIFs

All with grayscale filter and brightness adjustment for perfect text readability!

---

## ✅ What Was Updated

### 1. **Database Model** ✅

**File:** `models/HomepageContent.js`

Added:

- `heroMediaType` - Choose: "image", "video", or "gif"
- `heroVideoUrl` - URL for video or GIF file

### 2. **Frontend Component** ✅

**File:** `src/components/Homepage-sections/HeroImageSection.js`

Now supports:

- Image backgrounds (existing)
- Video backgrounds (NEW!)
- GIF backgrounds (NEW!)
- Autoplay with no audio
- Loop forever
- Mobile-optimized (playsInline)

### 3. **Admin Panel** ✅

**File:** `src/components/admin/HomepageContentEditor.js`

Added to **"Hero"** tab:

- Radio buttons to select media type
- Conditional fields (image uploader OR video URL input)
- Helpful tips and placeholder text

---

## 🎯 How to Use

### In Admin Panel:

1. **Login** to admin panel
2. Go to **"Homepage Content"**
3. Click the **"Hero"** tab
4. **You'll see 3 radio buttons:**
   ```
   ○ Image    ○ Video    ○ GIF
   ```
5. **Select your media type**
6. **Based on selection:**

---

### Option 1: Image (Default) 🖼️

**When selected:**

- Shows the image upload component
- Upload to Cloudinary or paste URL
- Automatic optimization

**Best for:**

- High-quality photos
- Church building shots
- Worship scenes
- Static backgrounds

---

### Option 2: Video 🎬

**When selected:**

- Shows a URL input field
- Paste your video URL

**Features:**

- ✅ **Autoplay** - Starts automatically
- ✅ **Muted** - No sound
- ✅ **Loop** - Plays forever
- ✅ **Mobile-friendly** - Works on phones

**Supported Formats:**

- MP4 (recommended)
- WebM
- OGG

**Example URLs:**

```
Cloudinary:
https://res.cloudinary.com/your-cloud/video/upload/v123456/hero-video.mp4

Direct URL:
https://example.com/videos/church-worship.mp4

YouTube (NOT supported - use downloadable files)
```

**Best for:**

- Worship moments
- Church events
- Dynamic backgrounds
- Engaging visuals

**💡 Tips:**

- Keep under 10MB for fast loading
- Use Cloudinary to host and optimize
- Recommended size: 1920x1080 (Full HD)
- Keep duration: 10-30 seconds for looping

---

### Option 3: GIF 🎭

**When selected:**

- Shows a URL input field
- Paste your GIF URL

**Features:**

- ✅ **Autoplay** - Starts automatically
- ✅ **Loop** - Repeats forever
- ✅ **No sound** - Silent animations
- ✅ **Cloudinary-optimized** - Use Cloudinary for best performance

**Example URLs:**

```
Cloudinary GIF:
https://res.cloudinary.com/your-cloud/image/upload/v123456/animation.gif

Direct GIF URL:
https://example.com/animations/worship.gif
```

**Best for:**

- Simple animations
- Cinemagraphs
- Subtle movements
- Lightweight motion

**💡 Tips:**

- Keep file size under 5MB
- Use Cloudinary to optimize GIFs
- Simple animations work best
- Avoid too many colors

---

## 📊 Comparison

| Type      | File Size  | Best For             | Performance    |
| --------- | ---------- | -------------------- | -------------- |
| **Image** | 100-500 KB | Static shots, photos | ⚡⚡⚡ Fastest |
| **GIF**   | 1-5 MB     | Simple animations    | ⚡⚡ Fast      |
| **Video** | 5-10 MB    | Dynamic motion       | ⚡ Good        |

---

## 🎨 Visual Effects Applied

All media types get:

- ✅ **Grayscale filter** (100%)
- ✅ **Brightness reduction** (85%)
- ✅ **Overlay tint** (rgba(0,0,0,0.6))

This ensures text is always readable on top!

---

## 🔧 Technical Details

### Video Element Attributes:

```html
<video
  autoplay
  ←
  Starts
  automatically
  loop
  ←
  Plays
  forever
  muted
  ←
  No
  sound
  playsinline
  ←
  Works
  on
  mobile
></video>
```

### Browser Compatibility:

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop and mobile
- ✅ iOS and Android

### Fallback:

If video fails to load → Shows gray background

---

## 📱 Mobile Considerations

### Video on Mobile:

- Uses `playsInline` to prevent fullscreen
- Autoplays without user interaction
- No sound to avoid interruptions
- Optimized for data usage

### Recommendations:

- Keep videos short (10-30 seconds)
- Use compressed formats
- Test on mobile devices
- Consider image for slower connections

---

## 💡 Best Practices

### For Videos:

1. **Compress before uploading**
   - Use Cloudinary for automatic compression
   - Target: 5-10 MB max
2. **Choose right dimensions**
   - 1920x1080 (Full HD) for desktop
   - 1280x720 (HD) for smaller file size
3. **Keep it short**
   - 10-30 seconds max
   - Loops seamlessly
4. **Use Cloudinary**
   - Automatic optimization
   - Adaptive streaming
   - Format conversion

### For GIFs:

1. **Optimize the GIF**
   - Use Cloudinary
   - Reduce colors
   - Limit frames
2. **Keep it simple**

   - Subtle movements
   - Few colors
   - Small dimensions

3. **File size**
   - Target: Under 3MB
   - Use Cloudinary optimization

---

## 🎯 Example Use Cases

### Video Examples:

```
1. Worship Service
   - Clip of congregation worshiping
   - Hands raised in praise
   - 15 seconds, looping

2. Church Building
   - Slow pan of church exterior
   - Golden hour lighting
   - 20 seconds, looping

3. Community
   - People gathering, greeting
   - Smiling faces
   - 10 seconds, looping
```

### GIF Examples:

```
1. Waving Flag
   - Church flag waving
   - Simple, elegant
   - Small file size

2. Candles
   - Flickering candles
   - Peaceful ambiance
   - Subtle movement

3. Text Animation
   - Animated church name
   - Fading in/out
   - Professional look
```

---

## 🚀 How to Add a Video

### Step 1: Upload to Cloudinary

**Option A: Through Cloudinary Dashboard**

1. Go to: https://cloudinary.com/console
2. Click "Media Library"
3. Click "Upload"
4. Select your video file
5. Wait for upload
6. Copy the URL

**Option B: Through API** (Advanced)

- Use Cloudinary's video upload API
- Similar to image upload
- Returns video URL

### Step 2: Add to Admin Panel

1. Admin Panel → Homepage Content → **"Hero"** tab
2. Select **"Video"** radio button
3. Paste the Cloudinary video URL
4. Click **"Save Changes"**

### Step 3: Test on Homepage

1. Go to homepage
2. Video should autoplay
3. No sound
4. Loops forever
5. Works on mobile

---

## 📹 Cloudinary Video URLs

### Format:

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1234567890/video-filename.mp4
```

### With Transformations (Optimized):

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/q_auto,w_1920/v1234567890/video-filename.mp4
```

**Transformations:**

- `q_auto` - Auto quality
- `w_1920` - Max width 1920px
- `vc_auto` - Auto codec

---

## 🎭 Cloudinary GIF URLs

### Format:

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/fl_anim/v1234567890/animation.gif
```

### With Optimizations:

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/fl_anim,q_auto,f_auto/v1234567890/animation.gif
```

**Flags:**

- `fl_anim` - Animated flag
- `q_auto` - Auto quality
- `f_auto` - Auto format (converts to WebM when supported)

---

## 🐛 Troubleshooting

### Video Not Playing?

1. **Check URL**

   - Must be accessible
   - Must be MP4 format
   - Test URL in browser

2. **Check File Size**

   - Large videos load slowly
   - Compress to under 10MB
   - Use Cloudinary optimization

3. **Check Mobile**
   - iOS requires `playsInline`
   - Already added ✅
   - Some browsers block autoplay

### Video Shows but No Movement?

- Check if video file is valid
- Try opening URL directly in browser
- Verify it's not a static image

### Performance Issues?

- Video too large (compress it)
- Use Cloudinary's video optimization
- Consider using GIF instead
- Fall back to image for slow connections

---

## 💰 Cloudinary Video Pricing

### Free Tier Includes:

- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Video transformations

### Typical Usage:

- 10 videos × 5 MB = 50 MB storage ✅
- 10,000 views × optimized = ~10 GB bandwidth ✅

**You'll stay FREE!** 🎉

---

## 🎯 Quick Start

1. **Upload video to Cloudinary**
2. **Copy the video URL**
3. **Admin Panel** → Homepage Content → Hero tab
4. **Select "Video"** radio button
5. **Paste URL** in the input field
6. **Save Changes**
7. **Visit homepage** → Video autoplays! 🎬

---

## 🎉 Summary

**Your hero section now supports:**

✅ **Images** - Static, Cloudinary-optimized  
✅ **Videos** - Autoplay, muted, looping  
✅ **GIFs** - Animated, optimized

**All with:**

- ⚡ Fast loading
- 🎨 Grayscale filter
- 📱 Mobile support
- 🔄 Auto-loop
- 🔇 No sound
- ✅ Easy admin control

**Choose the perfect media type for your homepage!** 🚀

---

## 📚 Related Files

### Components:

- `src/components/Homepage-sections/HeroImageSection.js`
- `src/components/admin/HomepageContentEditor.js`

### Database:

- `models/HomepageContent.js`

### Documentation:

- [Cloudinary Video Docs](https://cloudinary.com/documentation/video_manipulation_and_delivery)
- [Cloudinary GIF Docs](https://cloudinary.com/documentation/image_transformations#animated_images)

---

**Make your hero section dynamic and engaging!** 🎬✨
