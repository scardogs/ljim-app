# Vercel Deployment Guide for LJIM App

Complete guide to deploying your LJIM admin application to Vercel.

---

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Code**

Make sure all changes are committed:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

**Option A: Using Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

### 3. **Add Environment Variables**

In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following:

```
# Required
MONGODB_URI = mongodb+srv://your-connection-string
JWT_SECRET = your-secure-jwt-secret

# Email Configuration
EMAIL_SERVICE = gmail
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
EMAIL_FROM_NAME = LJIM Admin
```

**Important:**

- ✅ **DO NOT** add `NEXT_PUBLIC_BASE_URL` - it's auto-detected!
- ✅ The system automatically uses your Vercel domain
- ✅ Works with custom domains too

### 4. **Redeploy**

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots** on the latest deployment
3. Click **"Redeploy"**

Or trigger a new deployment by pushing code:

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

---

## 🌐 How Dynamic URLs Work

### The System Automatically Detects:

| Environment       | URL Generated                            | How                            |
| ----------------- | ---------------------------------------- | ------------------------------ |
| **Local Dev**     | `http://localhost:3000`                  | Default fallback               |
| **Vercel**        | `https://your-app.vercel.app`            | From `x-forwarded-host` header |
| **Custom Domain** | `https://yourdomain.com`                 | From `x-forwarded-host` header |
| **Preview**       | `https://your-app-git-branch.vercel.app` | From `x-forwarded-host` header |

### Why You Don't Need NEXT_PUBLIC_BASE_URL:

The approval endpoint (`approve.js`) automatically detects the URL:

```javascript
// This code runs automatically
const protocol = req.headers["x-forwarded-proto"] || "http";
const host =
  req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
```

**Result:**

- ✅ On Vercel: Reads `https` from `x-forwarded-proto`
- ✅ Reads your domain from `x-forwarded-host`
- ✅ Approval links automatically use the correct URL!

---

## 📋 Environment Variables Checklist

### Required for Vercel:

- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Your JWT secret key
- [ ] `EMAIL_SERVICE` - Email service provider (e.g., gmail)
- [ ] `EMAIL_USER` - Your email address
- [ ] `EMAIL_PASSWORD` - App password (not regular password)
- [ ] `EMAIL_FROM_NAME` - Display name for emails

### Optional (Auto-detected):

- [ ] `NEXT_PUBLIC_BASE_URL` - Only if you need to override auto-detection

### NOT Needed:

- ❌ `NODE_ENV` - Vercel sets this automatically
- ❌ `PORT` - Vercel handles this
- ❌ `VERCEL_URL` - Provided automatically by Vercel

---

## 🔧 Testing Your Deployment

### 1. Test the Website

Visit your Vercel URL:

```
https://your-app.vercel.app
```

### 2. Test Registration Approval

1. Go to `/register`
2. Submit a test registration request
3. Login to admin panel
4. Approve the request
5. **Check the approval link** - it should use your Vercel domain!

Example approval link:

```
https://your-app.vercel.app/register/complete?token=abc123...
```

### 3. Test Email Sending

1. Approve a registration request
2. Check if email was sent (green toast notification)
3. Check the recipient's inbox
4. Verify the approval link in the email uses your Vercel domain

---

## 🎯 Custom Domain Setup

### Add Custom Domain to Vercel

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `ljim.org`)
3. Follow Vercel's DNS instructions
4. Wait for DNS propagation (can take up to 48 hours)

### No Code Changes Needed!

Once your custom domain is active:

- ✅ Approval links automatically use `https://ljim.org`
- ✅ Emails automatically use the custom domain
- ✅ No environment variables to update
- ✅ Everything just works!

---

## 🐛 Troubleshooting

### Approval Links Still Show localhost

**Cause:** You might have `NEXT_PUBLIC_BASE_URL` set to localhost

**Solution:**

1. Go to Vercel → Settings → Environment Variables
2. **Delete** `NEXT_PUBLIC_BASE_URL` if it exists
3. Redeploy your application

### Environment Variables Not Working

**Solutions:**

1. Check for typos in variable names (case-sensitive!)
2. Redeploy after adding variables
3. Check Vercel function logs for errors
4. Verify values don't have extra spaces

### Emails Not Sending on Vercel

**Check:**

1. All email environment variables are set
2. App password (not regular Gmail password)
3. No firewall blocking SMTP
4. Vercel function logs for error details

### Database Connection Fails

**Solutions:**

1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
3. Ensure database user has correct permissions
4. Check Vercel function logs

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard

Monitor your app:

- **Deployments** - See all deployments and their status
- **Functions** - View serverless function logs
- **Analytics** - Track page views and performance
- **Logs** - Real-time application logs

### Important Logs to Watch

After approval, check for:

```bash
# Success
Approval email sent to: user@example.com
Approval email sent: <messageId>

# Check the generated URL
Approval link: https://your-app.vercel.app/register/complete?token=...
```

---

## 🚢 Deployment Best Practices

### 1. Use Git Branches

```bash
# Development
git checkout -b development
git push origin development

# Production
git checkout main
git push origin main
```

### 2. Environment-Specific Variables

Vercel allows different variables per environment:

- **Production** - For main branch
- **Preview** - For pull requests
- **Development** - For local dev

### 3. Test Before Merging

1. Create a pull request
2. Vercel creates a preview deployment
3. Test the preview URL
4. Merge when everything works

### 4. Enable Vercel Logs

Keep logs enabled to debug issues:

- Go to Settings → Functions
- Enable "Logging"

---

## 📱 Mobile-Friendly Emails

The email templates are already mobile-responsive, but test them:

1. Send a test approval email
2. Open on mobile device
3. Verify:
   - Button is clickable
   - Text is readable
   - Link copies correctly

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Website loads at Vercel URL
- [ ] Admin login works
- [ ] Registration request submission works
- [ ] Email sending works (approval & rejection)
- [ ] Approval links use Vercel domain (not localhost)
- [ ] Registration completion works via email link
- [ ] All admin features work
- [ ] Database connection stable
- [ ] No errors in Vercel function logs

---

## 🔐 Security Recommendations

### 1. Environment Variables

- ✅ Never commit `.env.local` to git
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Use Gmail App Passwords (not regular password)
- ✅ Rotate secrets periodically

### 2. Database Security

- ✅ Use strong MongoDB passwords
- ✅ Enable IP whitelist (or use 0.0.0.0/0 for Vercel)
- ✅ Enable MongoDB audit logs
- ✅ Regular backups

### 3. Vercel Security

- ✅ Enable "Deployment Protection"
- ✅ Use environment variables for secrets
- ✅ Review function logs regularly
- ✅ Set up monitoring/alerts

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Environment Variables Best Practices](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎊 You're Ready!

Your LJIM app is now:

- ✅ Deployed to Vercel
- ✅ Using dynamic URLs (no hardcoding!)
- ✅ Sending emails automatically
- ✅ Fully production-ready

**Your approval links will automatically be:**

- Development: `http://localhost:3000/register/complete?token=...`
- Vercel: `https://your-app.vercel.app/register/complete?token=...`
- Custom Domain: `https://yourdomain.com/register/complete?token=...`

**No configuration needed - it just works!** 🚀

---

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Author:** LJIM Development Team
