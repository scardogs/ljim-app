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

# Email Configuration (Required for automatic approval emails)
# For Gmail: Use App Passwords (https://myaccount.google.com/apppasswords)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM_NAME=LJIM Admin

# Next.js Environment
NODE_ENV=development
```

## Important Notes:

1. **MONGODB_URI**: This should be your MongoDB Atlas connection string. You mentioned it's stored in `config.env` under `ATLAS_URI`. Copy that value here.

2. **JWT_SECRET**: In production, use a secure random string. Never share this publicly.

3. **NEXT_PUBLIC_BASE_URL**: ⚡ **LEAVE COMMENTED OUT** - The system **automatically detects** the URL from request headers. You do **NOT** need to set this for Vercel! Only uncomment if you need to force a specific URL (very rare).

4. **EMAIL_SERVICE**: Email provider service (default: gmail). Supports any service that nodemailer supports.

5. **EMAIL_USER**: Your email address used to send approval/rejection emails.

6. **EMAIL_PASSWORD**: For Gmail, use an **App Password** (not your regular password). Generate one at [Google App Passwords](https://myaccount.google.com/apppasswords).

7. **EMAIL_FROM_NAME**: Display name in the "From" field of emails (e.g., "LJIM Admin").

8. **File Location**: The `.env.local` file should be in the root directory (same level as package.json)

9. **Git**: Make sure `.env.local` is in your `.gitignore` file (it already should be by default in Next.js projects)

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

| Variable          | Value                          | Example               |
| ----------------- | ------------------------------ | --------------------- |
| `MONGODB_URI`     | Your MongoDB connection string | `mongodb+srv://...`   |
| `JWT_SECRET`      | Your secure JWT secret         | `abc123...`           |
| `EMAIL_SERVICE`   | Email provider                 | `gmail`               |
| `EMAIL_USER`      | Your email address             | `admin@ljim.com`      |
| `EMAIL_PASSWORD`  | Gmail app password             | `abcd efgh ijkl mnop` |
| `EMAIL_FROM_NAME` | Display name                   | `LJIM Admin`          |

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
