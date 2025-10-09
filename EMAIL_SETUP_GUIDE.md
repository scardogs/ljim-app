# Email Setup Guide for Registration Approval System

This guide explains how to set up automatic email notifications for the registration approval system.

---

## 📧 Overview

When you approve or reject a registration request, the system automatically:

- ✅ Sends a **professional HTML email** to the user
- ✅ Includes the **approval link** (for approved requests)
- ✅ Provides **7-day expiration notice**
- ✅ Falls back to **manual link** if email fails
- ✅ Shows **email status** in admin UI

---

## 🚀 Quick Setup (Gmail)

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on **2-Step Verification**
3. Follow the prompts to enable it

### Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from the dropdown
3. Select **Other (Custom name)**
4. Enter "LJIM App" (or any name)
5. Click **Generate**
6. **Copy** the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # The app password (no spaces)
EMAIL_FROM_NAME=LJIM Admin
```

### Step 4: Test the Setup

1. Restart your development server: `npm run dev`
2. Go to Admin → Registration Requests
3. Approve a test registration request
4. Check if the email was sent (look for success/warning toast)

---

## 📝 Environment Variables

| Variable          | Description                         | Required | Example            |
| ----------------- | ----------------------------------- | -------- | ------------------ |
| `EMAIL_SERVICE`   | Email provider                      | Yes      | `gmail`            |
| `EMAIL_USER`      | Your email address                  | Yes      | `admin@ljim.com`   |
| `EMAIL_PASSWORD`  | App password (not regular password) | Yes      | `abcdefghijklmnop` |
| `EMAIL_FROM_NAME` | Display name in "From" field        | Yes      | `LJIM Admin`       |

---

## 🎨 Email Templates

### Approval Email Features

- 🎉 **Congratulatory header** with ministry branding
- 📋 **Clear next steps** for the user
- 🔗 **Clickable button** with approval link
- ⚠️ **Expiration warning** (7 days)
- 📱 **Mobile-responsive** design
- 🔒 **Security tips** included

### Rejection Email Features

- 📧 **Professional tone**
- 📝 **Optional rejection reason** included
- 💬 **Contact information** for follow-up
- 🏢 **Ministry branding**

---

## 🌐 Supported Email Services

The system uses [Nodemailer](https://nodemailer.com/) and supports:

### Pre-configured Services

- ✅ **Gmail** (recommended)
- ✅ **Outlook**
- ✅ **Yahoo**
- ✅ **iCloud**
- ✅ **Hotmail**
- ✅ **Mail.ru**
- ✅ **QQ**
- ✅ **163**
- ✅ And many more...

### Using Other Providers

For services not listed, you can use custom SMTP settings (requires code modification).

---

## 🔧 Troubleshooting

### "Failed to send email" Error

**Possible causes:**

1. **Incorrect app password** - Regenerate and try again
2. **2-Step Verification not enabled** - Enable it first
3. **Wrong email/password** - Double-check credentials
4. **Network issues** - Check internet connection
5. **Less secure app access** - Use App Password instead

**Solutions:**

1. Verify all environment variables are correct
2. Restart your development server
3. Check server logs for detailed error messages
4. Test with a simple Gmail account first

### Email Sent But Not Received

**Check:**

1. **Spam folder** - Email might be filtered
2. **Email address** - Verify it's correct in the request
3. **Gmail sending limits** - Gmail has daily limits
4. **Email server logs** - Check console for errors

### Email Works Locally But Not on Vercel

**Solutions:**

1. Add environment variables in Vercel dashboard
2. Redeploy after adding env variables
3. Check Vercel function logs
4. Verify no firewall blocking emails

---

## 📊 Email Status Indicators

### In Admin UI

After approving/rejecting a request, you'll see:

| Status     | Toast Type       | Message                                          |
| ---------- | ---------------- | ------------------------------------------------ |
| ✅ Success | Green (success)  | "Email sent successfully to the user"            |
| ⚠️ Warning | Orange (warning) | "Approval link generated (email failed to send)" |
| ❌ Error   | Red (error)      | "Failed to approve request"                      |

### In Server Logs

```bash
# Success
Approval email sent: <message-id>

# Failure
Failed to send approval email: Error message details
```

---

## 🎯 Testing Email Configuration

### Method 1: Through Admin UI

1. Create a test registration request
2. Approve it in the admin panel
3. Check the toast notification
4. Check the recipient's inbox

### Method 2: Check Server Logs

```bash
# Look for these logs:
Approval email sent to: user@example.com
Approval email sent: <messageId>

# Or errors:
Failed to send approval email: [error details]
```

---

## 🌟 Email Content Preview

### Approval Email

```
Subject: Your Admin Access Request Has Been Approved! 🎉

From: LJIM Admin <admin@ljim.com>

[Professional HTML template with:]
- LJIM branding
- Personalized greeting
- Clear instructions
- Prominent "Complete Registration" button
- Security notices
- Expiration warning
- Contact information
```

### Rejection Email

```
Subject: Update on Your Admin Access Request

From: LJIM Admin <admin@ljim.com>

[Professional HTML template with:]
- LJIM branding
- Polite notification
- Optional rejection reason
- Contact information for follow-up
```

---

## 🚀 Deployment to Vercel

### Add Environment Variables

1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
EMAIL_SERVICE = gmail
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password-here
EMAIL_FROM_NAME = LJIM Admin
```

5. Click **Save**
6. **Redeploy** your application

### Verify on Production

1. Test the approval flow on your live site
2. Check Vercel function logs for email status
3. Verify emails are being received

---

## 📚 Advanced Configuration

### Custom SMTP Server

If you need to use a custom SMTP server, modify `src/utils/email.js`:

```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.yourserver.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};
```

### Email Template Customization

Email templates are in `src/utils/email.js`:

- `sendApprovalEmail()` - Approval email template
- `sendRejectionEmail()` - Rejection email template

Customize the HTML/text content as needed.

---

## ✅ Checklist

Before going to production:

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] Environment variables added to `.env.local`
- [ ] Tested locally with real email
- [ ] Environment variables added to Vercel
- [ ] Tested on production
- [ ] Verified emails not going to spam
- [ ] Reviewed email content and branding
- [ ] Tested both approval and rejection emails

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review server/console logs
3. Verify all environment variables
4. Test with a different email address
5. Check [Nodemailer documentation](https://nodemailer.com/)

---

## 🎉 Success!

Once configured, your registration approval system will:

- ✅ Automatically send emails on approve/reject
- ✅ Provide professional, branded communication
- ✅ Make the user experience seamless
- ✅ Keep you informed of email status
- ✅ Fallback gracefully if emails fail

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Author:** LJIM Development Team
