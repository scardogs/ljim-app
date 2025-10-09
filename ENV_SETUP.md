# Environment Variables Setup

Create a `.env.local` file in the root directory of your project with the following variables:

```env
# MongoDB Connection String
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ljim?retryWrites=true&w=majority

# JWT Secret Key
# Generate a secure random string for production
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (Required for automatic approval emails)
# For Gmail: Use App Passwords (https://myaccount.google.com/apppasswords)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM_NAME=LJIM Admin

# ============================================================
# Cloudinary Configuration (for Image Uploads)
# ============================================================
# Sign up at: https://cloudinary.com/users/register_free
# Get your credentials from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# Public (for frontend) - Same as CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# ============================================================
# BASE URL - LEAVE THIS COMMENTED OUT (Auto-detected!)
# ============================================================
# The system automatically detects your URL from request headers
# You DON'T need to set this for Vercel deployment!
#
# It will automatically be:
# - Local: http://localhost:3000
# - Vercel: https://your-app.vercel.app
# - Custom Domain: https://yourdomain.com
#
# Only uncomment if you need to force a specific URL:
# NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Next.js Environment
NODE_ENV=development
```

## Important Notes:

1. **MONGODB_URI**: This should be your MongoDB Atlas connection string. You mentioned it's stored in `config.env` under `ATLAS_URI`. Copy that value here.

2. **JWT_SECRET**: In production, use a secure random string. Never share this publicly.

3. **CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET**: Get these from your Cloudinary dashboard at https://cloudinary.com/console after signing up for a free account.

4. **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**: Must be the same value as CLOUDINARY_CLOUD_NAME. This is used by the frontend to display images.

5. **NEXT_PUBLIC_BASE_URL**: ⚡ **LEAVE COMMENTED OUT** - The system **automatically detects** the URL from request headers. You do **NOT** need to set this for Vercel! Only uncomment if you need to force a specific URL (very rare).

6. **EMAIL_SERVICE**: Email provider service (default: gmail). Supports any service that nodemailer supports.

7. **EMAIL_USER**: Your email address used to send approval/rejection emails.

8. **EMAIL_PASSWORD**: For Gmail, use an **App Password** (not your regular password). Generate one at [Google App Passwords](https://myaccount.google.com/apppasswords).

9. **EMAIL_FROM_NAME**: Display name in the "From" field of emails (e.g., "LJIM Admin").

10. **File Location**: The `.env.local` file should be in the root directory (same level as package.json)

11. **Git**: Make sure `.env.local` is in your `.gitignore` file (it already should be by default in Next.js projects)

## Generating a Secure JWT Secret

Run this command in your terminal to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET value.

## Deployment to Vercel

When deploying to Vercel, add these environment variables in your Vercel project settings:

1. Go to your Vercel project → Settings → Environment Variables
2. Add **ONLY** the following (do NOT add NEXT_PUBLIC_BASE_URL):

| Variable                            | Value                          | Example               |
| ----------------------------------- | ------------------------------ | --------------------- |
| `MONGODB_URI`                       | Your MongoDB connection string | `mongodb+srv://...`   |
| `JWT_SECRET`                        | Your secure JWT secret         | `abc123...`           |
| `EMAIL_SERVICE`                     | Email provider                 | `gmail`               |
| `EMAIL_USER`                        | Your email address             | `admin@ljim.com`      |
| `EMAIL_PASSWORD`                    | Gmail app password             | `abcd efgh ijkl mnop` |
| `EMAIL_FROM_NAME`                   | Display name                   | `LJIM Admin`          |
| `CLOUDINARY_CLOUD_NAME`             | Your Cloudinary cloud name     | `your-cloud-name`     |
| `CLOUDINARY_API_KEY`                | Your Cloudinary API key        | `123456789012345`     |
| `CLOUDINARY_API_SECRET`             | Your Cloudinary API secret     | `abcdefg...`          |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as CLOUDINARY_CLOUD_NAME  | `your-cloud-name`     |

**⚠️ Important: DO NOT add `NEXT_PUBLIC_BASE_URL`**

The system automatically detects your Vercel URL from request headers (`x-forwarded-host` and `x-forwarded-proto`). This means:

- ✅ Approval links automatically use `https://your-app.vercel.app`
- ✅ Works with custom domains automatically
- ✅ Works with preview deployments
- ✅ No configuration needed!

### How Dynamic URL Detection Works:

The system generates approval links using this priority:

1. `NEXT_PUBLIC_BASE_URL` environment variable (if set)
2. Auto-detected from request headers:
   - Protocol: `x-forwarded-proto` (https on Vercel)
   - Host: `x-forwarded-host` or `host` header (your-app.vercel.app)
3. Fallback: `http://localhost:3000` (development only)

This means your approval links will automatically be:

- **Local Development**: `http://localhost:3000/register/complete?token=...`
- **Vercel Production**: `https://your-app.vercel.app/register/complete?token=...`
- **Custom Domain**: `https://yourdomain.com/register/complete?token=...`

## Email Configuration

### Setting up Gmail App Password

1. **Enable 2-Step Verification** on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Other (Custom name)"
4. Name it "LJIM App" or similar
5. Click **Generate**
6. Copy the 16-character password
7. Use this password in `EMAIL_PASSWORD` (not your regular Gmail password)

### Supported Email Services

The system uses Nodemailer and supports many email services:

- `gmail` (recommended for simplicity)
- `outlook`
- `yahoo`
- `icloud`
- Custom SMTP (requires additional configuration)

### Email Features

When you approve or reject a registration request:

- ✅ **Automatic email sending** to the user
- ✅ **Professional HTML templates** with branding
- ✅ **Approval link** embedded in the email
- ✅ **7-day expiration notice** for approval links
- ✅ **Fallback to manual link** if email fails (still shows in modal)
- ✅ **Email status notification** in admin UI (success/warning toast)

## Cloudinary Configuration

### Setting up Cloudinary (Free - 25 GB Storage + Bandwidth)

**Why Cloudinary?**

- ✅ 25 GB FREE storage & bandwidth per month
- ✅ Automatic image optimization (WebP, AVIF)
- ✅ On-the-fly image transformations
- ✅ Global CDN for fast delivery
- ✅ No credit card required for free tier

**Quick Setup:**

1. **Sign up for FREE**: https://cloudinary.com/users/register_free
2. **Verify your email** and log in
3. **Get your credentials** from the dashboard:
   - Go to: https://cloudinary.com/console
   - You'll see three values:
     - `Cloud Name`
     - `API Key`
     - `API Secret`
4. **Copy these to your `.env.local` file**:

   ```env
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   ```

5. **Restart your dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C) then:
   npm run dev
   ```

**That's it!** Your image uploads should now work. Test at:

- Test page: http://localhost:3000/test-cloudinary (no login required)
- Admin panel: http://localhost:3000/admin (requires login)

### Cloudinary Features in Your App

- 📤 **Image Upload**: Admins can upload images for homepage, events, shop items
- 🗑️ **Image Delete**: Remove images from Cloudinary when deleted from your app
- 🖼️ **Automatic Optimization**: All images auto-converted to WebP/AVIF for faster loading
- 📏 **On-the-fly Resizing**: No need to upload multiple sizes - Cloudinary generates them
- 🌍 **Global CDN**: Images delivered from nearest server to your users

### Troubleshooting

**"Failed to upload image" error:**

- ✅ Make sure your `.env.local` file exists in the root directory
- ✅ Check that all 4 Cloudinary variables are set correctly
- ✅ Restart your dev server after adding environment variables
- ✅ Verify your credentials at https://cloudinary.com/console

**Still not working?**

- Check the browser console for detailed error messages
- Verify environment variables loaded: Open http://localhost:3000/api/health (if you create a test endpoint)
- Make sure the Cloudinary account is active (check email for verification link)
