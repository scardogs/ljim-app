# 🚨 Fix "Failed to upload image" Error

## The Problem

You're seeing this error because **Cloudinary environment variables are not configured**.

## Quick Fix (5 Minutes)

### Step 1: Create `.env.local` file

In the root of your project (same folder as `package.json`), create a file named `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Your existing variables (if you have them)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
```

### Step 2: Get Your Cloudinary Credentials

1. **Sign up FREE** (no credit card): https://cloudinary.com/users/register_free
2. **Verify your email** and log in
3. **Go to dashboard**: https://cloudinary.com/console
4. **Copy these 3 values**:
   - `Cloud Name` → use for `CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `API Key` → use for `CLOUDINARY_API_KEY`
   - `API Secret` → use for `CLOUDINARY_API_SECRET`

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C or kill the terminal)
# Then start it again:
npm run dev
```

### Step 4: Test It

- **Test page** (no login): http://localhost:3000/test-cloudinary
- **Admin panel**: http://localhost:3000/admin

## Example `.env.local`

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ljim

# JWT
JWT_SECRET=your_secret_key_here

# Email (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=LJIM Admin

# Cloudinary (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=my-church-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-church-cloud

# Development
NODE_ENV=development
```

## Why Cloudinary?

✅ **FREE 25 GB** storage + bandwidth per month  
✅ **Automatic optimization** (WebP, AVIF)  
✅ **No credit card** required  
✅ **Global CDN** - fast delivery worldwide

## Still Having Issues?

1. **Check file location**: `.env.local` must be in the root (next to `package.json`)
2. **Check variable names**: Must match exactly (case-sensitive)
3. **Restart server**: Environment variables only load on startup
4. **Check console**: Open browser DevTools → Console for detailed errors
5. **Verify credentials**: Log into https://cloudinary.com/console to double-check

## For More Details

- Full setup guide: See `ENV_SETUP.md`
- Cloudinary guide: See `CLOUDINARY_SETUP_GUIDE.md`
- Quick start: See `CLOUDINARY_QUICK_START.md`


