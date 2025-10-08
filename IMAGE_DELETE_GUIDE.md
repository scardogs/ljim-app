# 🗑️ Image Deletion Guide

## ✅ What Was Added

I've implemented **automatic image deletion** that cleans up files from your server when you delete or replace images!

---

## 🎯 Features

### 1. **Delete Image Button** (❌)

When you click the delete button on an image preview:

- ✅ Deletes the file from `public/images/` folder
- ✅ Clears the database field
- ✅ Removes the preview
- ✅ Shows success notification

### 2. **Auto-Delete on Replace**

When you upload a new image to replace an old one:

- ✅ Old image is automatically deleted from server
- ✅ New image is uploaded
- ✅ Database field updates to new image
- ✅ No orphaned files left behind!

### 3. **Smart Detection**

- Only deletes images from your server (`/images/` folder)
- External URLs or manual paths are safely ignored
- Prevents accidental deletion of important files

---

## 🔧 How It Works

### Delete API Endpoint

**Location:** `/api/admin/delete-image`

**Security:**

- 🔒 Requires JWT authentication
- 🔒 Only allows deleting from `/images/` directory
- 🔒 Validates file paths to prevent directory traversal

**What it does:**

1. Validates the image path
2. Checks if file exists
3. Deletes the physical file
4. Returns success/error response

---

## 💡 Usage Examples

### Example 1: Delete an Image

```
Current: [████ Preview]  [❌] ← Delete button
         /images/1234-hero.jpg

1. Click the ❌ button
2. API call: DELETE /api/admin/delete-image
3. File deleted: public/images/1234-hero.jpg ✓
4. Field cleared: "" ✓
5. Toast: "Image Deleted" ✓
```

**Result:**

- ✅ File removed from server
- ✅ Database field cleared
- ✅ No orphaned files

---

### Example 2: Replace an Image

```
Current: /images/1234-old-hero.jpg
         [Upload New Image]

1. Click "Upload New Image"
2. Select new file: new-hero.jpg
3. Upload starts...
4. Old image deleted automatically ← This is new!
5. New image uploaded
6. Field updated: /images/5678-new-hero.jpg

Backend cleanup:
- ❌ Deleted: public/images/1234-old-hero.jpg
- ✅ Added: public/images/5678-new-hero.jpg
```

**Result:**

- ✅ Old file automatically removed
- ✅ New file uploaded
- ✅ Clean filesystem, no clutter!

---

### Example 3: External URLs (Safe)

```
Current: https://example.com/external-image.jpg
         [❌] Delete button

1. Click ❌
2. System detects: Not from /images/
3. Skips file deletion (external URL)
4. Only clears database field
```

**Result:**

- ✅ External URL not affected
- ✅ Database field cleared
- ✅ Safe operation

---

## 🔒 Security Features

### Path Validation

```javascript
// ✅ Allowed
"/images/hero-1234.jpg";
"/images/singer-photo.png";

// ❌ Blocked (security)
"../../../etc/passwd";
"/var/www/config.json";
"C:/Windows/System32/file.dll";
```

### Authentication Required

- All delete operations require valid JWT token
- Unauthorized requests are rejected
- Only admins can delete images

### Safe Defaults

- Only deletes from `public/images/` folder
- Validates file exists before deletion
- Handles errors gracefully
- Logs warnings for debugging

---

## 🧪 Testing Scenarios

### Test 1: Delete Hero Image

1. **Go to:** Admin → Home Content → Hero Section
2. **Current image:** `/images/hero-bg.jpg`
3. **Click:** ❌ delete button
4. **Check:** Toast shows "Image Deleted"
5. **Verify:** File gone from `public/images/`
6. **Result:** ✅ Clean deletion

### Test 2: Replace Singer Photo

1. **Go to:** Admin → Singers Section
2. **Current:** `/images/joshua.jpg`
3. **Upload:** New photo of Joshua
4. **Check:** Old joshua.jpg deleted automatically
5. **Verify:** New file exists, old file gone
6. **Result:** ✅ Auto-cleanup works

### Test 3: Clear External URL

1. **Set field to:** `https://cdn.example.com/image.jpg`
2. **Click:** ❌ delete button
3. **Check:** Field clears, no server delete attempted
4. **Result:** ✅ Safe handling of external URLs

---

## 📊 What Gets Deleted

### ✅ Deleted Automatically:

| Action      | Old Image | New Image  | Database  |
| ----------- | --------- | ---------- | --------- |
| Click ❌    | Deleted ✓ | -          | Cleared ✓ |
| Upload New  | Deleted ✓ | Uploaded ✓ | Updated ✓ |
| Clear Field | Deleted ✓ | -          | Cleared ✓ |

### ❌ NOT Deleted:

| Image Path     | Reason          | Action             |
| -------------- | --------------- | ------------------ |
| External URLs  | Not on server   | Field cleared only |
| Default images | Shared resource | Field cleared only |
| Manual paths   | User specified  | Field cleared only |

---

## 🎯 Benefits

### Before (No Auto-Delete):

```
public/images/
├── old-hero-1.jpg        ← Orphaned
├── old-hero-2.jpg        ← Orphaned
├── singer-old-1.jpg      ← Orphaned
├── singer-old-2.jpg      ← Orphaned
├── current-hero.jpg      ← Current
└── current-singer.jpg    ← Current

Problem: Disk space wasted! 💾
```

### After (With Auto-Delete):

```
public/images/
├── current-hero.jpg      ← Current only
└── current-singer.jpg    ← Current only

Benefit: Clean filesystem! ✨
```

---

## 🔄 Complete Workflow

### Upload & Replace Flow:

```
┌─────────────────────────────────┐
│ User uploads new image          │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Check: Is there an old image?   │
│ Path: /images/old-photo.jpg     │
└───────────┬─────────────────────┘
            │
            ▼ YES
┌─────────────────────────────────┐
│ DELETE old image from server    │
│ File: public/images/old-photo   │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ UPLOAD new image to server      │
│ File: public/images/new-photo   │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ UPDATE database field           │
│ New value: /images/new-photo    │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Show success notification       │
│ "Image uploaded: new-photo.jpg" │
└─────────────────────────────────┘
```

---

## 💡 Best Practices

### 1. **Always Save After Deleting**

```
❌ Delete image → Navigate away
✅ Delete image → Click "Save Changes"
```

### 2. **Test Deletions in Dev First**

```
1. Upload test image
2. Delete it
3. Verify it's gone
4. Then use in production
```

### 3. **Keep Backups**

```
Important images:
- Keep originals in separate folder
- Don't rely solely on server storage
- Use version control for critical assets
```

### 4. **Monitor Disk Usage**

```
Before deployment:
- Check public/images/ folder size
- Clean up test images
- Keep production lean
```

---

## 🐛 Troubleshooting

### Image not deleting?

**Check:**

- ✅ Are you logged in? (Valid JWT token)
- ✅ Is the path starting with `/images/`?
- ✅ Does the file actually exist on server?
- ✅ Check browser console for errors

### "File not found" error?

**Cause:** Image was already deleted or never existed

**Solution:**

- This is safe! Just clear the field
- Field will be cleared even if file is missing
- No negative impact on functionality

### Old images still on server?

**Check:**

- ✅ Did you click "Save Changes" after deleting?
- ✅ Look in `public/images/` folder
- ✅ Check if path is external URL (won't delete)
- ✅ Manually delete if needed

---

## 🔧 Technical Details

### Delete API Request:

```javascript
DELETE /api/admin/delete-image

Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json

Body:
  {
    "imagePath": "/images/1234-photo.jpg"
  }

Response (Success):
  {
    "success": true,
    "message": "Image deleted successfully",
    "deletedPath": "/images/1234-photo.jpg"
  }

Response (Error):
  {
    "error": "File not found"
  }
```

### File System Path Resolution:

```javascript
Input:  "/images/hero.jpg"
Resolves to:
  Windows: C:\projects\LJIM\frontend\ljim-app\public\images\hero.jpg
  Linux:   /var/www/ljim-app/public/images/hero.jpg
```

---

## 📝 Summary

### What Happens Now:

1. **Delete Button (❌)**

   - Deletes file from server ✓
   - Clears database field ✓
   - Shows notification ✓

2. **Upload New Image**

   - Deletes old image first ✓
   - Uploads new image ✓
   - Updates database ✓

3. **Safety Checks**
   - Only deletes from `/images/` ✓
   - Requires authentication ✓
   - Handles errors gracefully ✓

### Benefits:

✅ **Clean Filesystem** - No orphaned files  
✅ **Automatic Cleanup** - Deletes old images on replace  
✅ **Secure** - Protected with authentication  
✅ **Smart** - Only deletes server images  
✅ **User-Friendly** - Toast notifications  
✅ **Safe** - Validates all paths

---

## 🚀 Try It Now!

1. **Go to Admin:** `http://localhost:3000/admin`
2. **Upload a test image** in Hero Section
3. **Check** `public/images/` folder - new file appears
4. **Click ❌** delete button
5. **Check** folder again - file is gone! ✨
6. **Upload another** - old one auto-deletes

**Your images are now managed automatically!** 🎉

---

**No more orphaned files cluttering your server!** 🧹
