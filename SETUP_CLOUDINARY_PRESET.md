# Setup Cloudinary Upload Preset - 5 Minute Fix 🚀

## 🎯 Quick Fix for Vercel 413 Error

You need to create an **upload preset** in Cloudinary to allow direct uploads from your website.

**Time needed:** 5 minutes ⏱️

---

## 📝 Step-by-Step Instructions

### Step 1: Go to Cloudinary Dashboard

1. Open: **https://cloudinary.com/console**
2. **Login** with your Cloudinary account

### Step 2: Navigate to Upload Settings

1. Click the **⚙️ Settings** icon (top right corner)
2. Click the **"Upload"** tab in the left sidebar
3. Scroll down to **"Upload presets"** section

### Step 3: Create New Upload Preset

1. Click the **"Add upload preset"** link
2. Fill in the form:

```
┌─────────────────────────────────────┐
│ Preset name: ljim_unsigned          │ ← Type exactly this
│                                     │
│ Signing mode:                       │
│   ○ Signed                          │
│   ● Unsigned  ← Select this!        │
│                                     │
│ Folder: [leave empty]               │
│                                     │
│ Use filename: ☑ Yes                 │
│ Unique filename: ☑ Yes              │
└─────────────────────────────────────┘
```

3. **Click "Save"** button

### Step 4: Verify It Was Created

You should see your preset in the list:

```
Upload Presets:
  ✅ ljim_unsigned (Unsigned)
```

### Step 5: Done! Test Your Upload

1. **Push your code** to Git (if not already)
2. **Wait for Vercel** to deploy
3. **Go to** https://ljim.vercel.app/admin
4. **Try uploading** a video or large image
5. **Should work!** ✅

---

## ⚙️ Detailed Preset Settings (Optional)

For extra security and control, you can configure:

### General Settings:

- **Preset name:** `ljim_unsigned`
- **Signing mode:** Unsigned ✅

### Upload Manipulations:

- **Folder:** (leave empty - app sets it dynamically)
- **Use filename:** Yes ✅
- **Unique filename:** Yes ✅
- **Overwrite:** No

### Upload Control:

- **Allowed formats:**
  - Images: jpg, png, gif, webp
  - Videos: mp4, webm, mov
- **Max file size:** 52428800 (50MB in bytes)
- **Max image width:** 4000
- **Max image height:** 4000

### Security (Optional):

- **Enable moderation:** No (unless you want manual approval)
- **Auto tagging:** No
- **Context:** No

---

## 🔐 Why "Unsigned"?

**Unsigned uploads** allow your website to upload without exposing your API secret.

**Is it secure?**

- ✅ YES - Only works with your specific cloud name
- ✅ Preset controls what can be uploaded
- ✅ Can set file size limits
- ✅ Can restrict formats
- ✅ Your app still has admin auth
- ✅ Cloudinary monitors for abuse

---

## 🎯 What This Fixes

### Before (With Preset):

```
❌ Vercel 413 Error - Payload Too Large
❌ Can't upload videos on production
❌ Limited to 4.5MB files
```

### After (With Preset):

```
✅ Uploads work on Vercel
✅ Can upload videos up to 100MB
✅ Direct to Cloudinary (faster!)
✅ Progress bar works
```

---

## 🚀 Alternative: Quick Test Preset

If you want to test quickly, Cloudinary has a default preset:

**Use:** `ml_default` (but create `ljim_unsigned` for production)

To use default preset temporarily:

1. Change `ljim_unsigned` to `ml_default` in the code
2. Test uploads
3. Then create your own preset for production

---

## 🐛 Troubleshooting

### Can't Find Upload Presets?

1. Dashboard → Settings (⚙️ icon)
2. Click "Upload" tab on the LEFT sidebar
3. Scroll down to "Upload presets"
4. Click "Add upload preset"

### Preset Already Exists with Different Settings?

1. Find "ljim_unsigned" in the list
2. Click **"Edit"**
3. Change **Signing mode** to **"Unsigned"**
4. Save

### Still Getting 413 Error?

1. **Verify preset exists** - Check Cloudinary dashboard
2. **Verify name is exact:** `ljim_unsigned` (no spaces, lowercase)
3. **Verify signing mode:** Must be "Unsigned"
4. **Hard refresh browser:** Ctrl + Shift + R
5. **Clear browser cache**
6. **Wait 2-3 minutes** for Cloudinary to propagate changes

### Upload Preset Not Found Error?

Error message: `Upload preset not found`

**Solution:**

- The preset name in code must match EXACTLY
- Check spelling: `ljim_unsigned`
- Check it's created in the correct Cloudinary account
- Wait a few minutes after creating

---

## 📸 Visual Guide

### Where to Find Upload Settings:

```
Cloudinary Dashboard
    ↓
⚙️ Settings (top right)
    ↓
📤 Upload (left sidebar)
    ↓
Scroll down to "Upload presets"
    ↓
"Add upload preset" link
    ↓
Fill in form → Save
```

---

## ✅ Verification Checklist

After creating the preset:

- [ ] Preset name is exactly: `ljim_unsigned`
- [ ] Signing mode is: **Unsigned** (not Signed)
- [ ] Preset shows in the list
- [ ] Code has been pushed to Git
- [ ] Vercel has deployed (check deployment status)
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is in Vercel env vars
- [ ] Try uploading on https://ljim.vercel.app/admin
- [ ] Success! ✅

---

## 🎉 Summary

**To fix the 413 error:**

1. **Create upload preset** in Cloudinary (5 minutes)
   - Name: `ljim_unsigned`
   - Mode: Unsigned
2. **Push code** to Git (already done ✅)

3. **Test on Vercel** (after preset created)
   - Upload videos
   - Upload large images
   - Should work! ✅

**After this one-time setup, ALL uploads will work on Vercel!** 🚀

---

## 📞 Need Help?

Check these resources:

- [Cloudinary Upload Presets Docs](https://cloudinary.com/documentation/upload_presets)
- [Unsigned Upload Guide](https://cloudinary.com/documentation/upload_images#unsigned_upload)

Or watch: [How to Create Upload Preset (Video)](https://cloudinary.com/documentation/upload_presets#creating_upload_presets)

---

**5 minutes to fix - unlimited uploads on Vercel!** ⚡✨
