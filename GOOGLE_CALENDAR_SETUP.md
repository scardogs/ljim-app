# Google Calendar API Integration Guide

## Overview

Integrate Google Calendar API to manage church events, enable public calendar embedding, RSVP tracking, and automatic reminders - all for FREE!

## Benefits

- ✅ **FREE** - No cost for up to 1 million requests/day
- ✅ **Automatic Reminders** - Google handles all email/SMS notifications
- ✅ **Public Embedding** - Easy calendar widget for your website
- ✅ **Sync Across Devices** - Users can add to their personal calendars
- ✅ **No Database Storage** - Events stored in Google's infrastructure
- ✅ **RSVP Tracking** - Track attendees and send confirmations

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### 1.2 Create New Project

1. Click "Select a project" → "New Project"
2. Project name: `LJIM Church Calendar`
3. Click "Create"

### 1.3 Enable Google Calendar API

1. Go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click "Enable"

---

## Step 2: Create Service Account (For Server-Side Access)

### 2.1 Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Service account name: `ljim-calendar-service`
4. Click "Create and Continue"
5. Grant role: "Editor"
6. Click "Done"

### 2.2 Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON"
5. Click "Create" (downloads a JSON file)
6. **IMPORTANT**: Save this file securely - you'll need it!

### 2.3 Share Calendar with Service Account

1. Go to Google Calendar: https://calendar.google.com
2. Create a new calendar or use existing one:
   - Click "+" next to "Other calendars"
   - Select "Create new calendar"
   - Name: "LJIM Church Events"
   - Click "Create calendar"
3. Click settings (gear icon) → "Settings"
4. Select your church calendar from the left sidebar
5. Scroll to "Share with specific people"
6. Click "Add people"
7. Add the service account email (from the JSON file, looks like: `ljim-calendar-service@xxxxx.iam.gserviceaccount.com`)
8. Give permission: "Make changes to events"
9. Click "Send"

### 2.4 Get Calendar ID

1. In Calendar Settings, scroll to "Integrate calendar"
2. Copy the "Calendar ID" (looks like: `xxxxx@group.calendar.google.com`)
3. Save this - you'll need it!

---

## Step 3: Setup OAuth 2.0 (For User Authentication - Admin)

### 3.1 Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen:

   - User Type: "External"
   - App name: "LJIM Church Calendar"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Skip for now
   - Test users: Add your admin email
   - Click "Save and Continue"

4. Application type: "Web application"
5. Name: "LJIM Church Admin"
6. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.vercel.app` (for production)
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-domain.vercel.app/api/auth/google/callback`
8. Click "Create"
9. **Save the Client ID and Client Secret**

---

## Step 4: Configure Environment Variables

Add to your `.env.local` file:

```env
# Google Calendar Service Account (Server-side)
GOOGLE_SERVICE_ACCOUNT_EMAIL=ljim-calendar-service@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com

# Google OAuth (Admin Access)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# For Vercel Production
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com
```

### Getting the Private Key from JSON:

1. Open the service account JSON file
2. Find the `private_key` field
3. Copy the entire key INCLUDING `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
4. Make sure to keep the `\n` characters (they represent line breaks)

---

## Step 5: Install Required Packages

```bash
npm install googleapis google-auth-library
```

---

## Step 6: Make Calendar Public (Optional)

### For Public Embedding:

1. Go to Google Calendar Settings
2. Select your church calendar
3. Scroll to "Access permissions"
4. Check "Make available to public"
5. Set to "See all event details"

### Get Embed Code:

1. Scroll to "Integrate calendar"
2. Copy the "Embed code" (iframe)
3. Or use the Calendar ID with Google's widget

---

## Step 7: Test the Integration

### Test Service Account Access:

```javascript
// Test in Node.js or API route
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

calendar.events.list(
  {
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  },
  (err, res) => {
    if (err) return console.log("Error:", err);
    console.log("Events:", res.data.items);
  }
);
```

---

## Features Implementation

### 1. **Sync Church Events**

- Admin creates events via your website
- Events automatically sync to Google Calendar
- Updates and deletions propagate instantly

### 2. **Public Calendar Embedding**

- Embed calendar widget on events page
- Users can see all upcoming events
- Click to add to their personal calendar

### 3. **RSVP Tracking**

- Users RSVP via your website
- Store RSVPs in your database (lightweight)
- Send confirmation emails
- Display attendee count

### 4. **Automatic Reminders**

- Set reminders when creating events
- Google sends email/SMS notifications
- No custom notification system needed

---

## Rate Limits & Quotas

**Google Calendar API Free Tier:**

- 1,000,000 queries per day
- 10 queries per second per user
- More than enough for a church website!

---

## Security Best Practices

1. **Never commit** service account JSON or `.env.local`
2. Add to `.gitignore`:
   ```
   .env.local
   google-service-account.json
   ```
3. Use environment variables in Vercel
4. Rotate keys if compromised
5. Limit calendar sharing to service account only

---

## Vercel Deployment

### Add Environment Variables:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add all the variables from `.env.local`
4. **For GOOGLE_PRIVATE_KEY**: Paste the entire key with `\n` characters
5. Redeploy

---

## Troubleshooting

### "Invalid credentials" error:

- Check if private key is properly formatted with `\n`
- Verify service account email is correct
- Ensure calendar is shared with service account

### "Calendar not found":

- Verify Calendar ID is correct
- Check if service account has access
- Ensure calendar exists

### "Insufficient permissions":

- Service account needs "Make changes to events" permission
- Check calendar sharing settings

---

## Next Steps

After setup, you can:

1. Create API routes for calendar operations
2. Build admin interface for event management
3. Embed public calendar on events page
4. Implement RSVP system
5. Add "Add to Calendar" buttons

---

## Additional Resources

- [Google Calendar API Docs](https://developers.google.com/calendar/api/guides/overview)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)
- [Calendar Embed Guide](https://support.google.com/calendar/answer/41207)

---

## Cost Savings

**Before (Self-hosted):**

- Database storage for events
- Email service for reminders
- Custom notification system
- Event sync logic

**After (Google Calendar):**

- $0/month
- Google handles everything
- Better reliability
- Professional features
