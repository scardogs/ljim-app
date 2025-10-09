## Google Calendar Integration - Quick Start Guide

### 🎯 **Overview**

This guide will help you quickly set up and use the Google Calendar integration for your church events.

---

## ✅ **Prerequisites**

1. Complete the setup in `GOOGLE_CALENDAR_SETUP.md`
2. Have the following environment variables configured:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxxx
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com
   ```
3. Install dependencies:
   ```bash
   npm install googleapis google-auth-library
   ```

---

## 🚀 **Quick Test**

### Test Your Setup

Create a test file `test-calendar.js` in your project root:

```javascript
const { google } = require("googleapis");

async function testCalendar() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    console.log("✅ Calendar connection successful!");
    console.log("Upcoming events:", response.data.items);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testCalendar();
```

Run:

```bash
node test-calendar.js
```

---

## 📋 **Features Included**

### 1. **Event Management (Admin)**

- ✅ Create events from admin panel
- ✅ Update existing events
- ✅ Delete events
- ✅ Auto-sync to Google Calendar
- ✅ Send automatic reminders

### 2. **Public Calendar Display**

- ✅ Embed Google Calendar on events page
- ✅ List upcoming events
- ✅ Event details page
- ✅ "Add to Calendar" buttons

### 3. **RSVP System**

- ✅ Users can RSVP for events
- ✅ Track attendee count
- ✅ Admin view of all RSVPs
- ✅ Email notifications

---

## 🔌 **API Endpoints**

### Public Endpoints

#### Get Upcoming Events

```javascript
GET /api/calendar/events
GET /api/calendar/events?maxResults=10

Response:
{
  "success": true,
  "events": [
    {
      "id": "event123",
      "title": "Sunday Service",
      "description": "Join us for worship",
      "location": "Church Building",
      "start": "2024-01-01T10:00:00Z",
      "end": "2024-01-01T12:00:00Z",
      "htmlLink": "https://calendar.google.com/..."
    }
  ]
}
```

#### Get Single Event

```javascript
GET /api/calendar/events/[eventId]

Response:
{
  "success": true,
  "event": {
    "id": "event123",
    "title": "Sunday Service",
    // ... event details
  }
}
```

#### Submit RSVP

```javascript
POST /api/calendar/rsvp
Content-Type: application/json

{
  "eventId": "event123",
  "eventTitle": "Sunday Service",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "numberOfGuests": 2,
  "notes": "Bringing my family"
}

Response:
{
  "success": true,
  "message": "RSVP submitted successfully",
  "rsvp": { ... }
}
```

#### Get RSVP Count

```javascript
GET /api/calendar/rsvp?eventId=event123

Response:
{
  "success": true,
  "count": 25
}
```

### Admin Endpoints (Require Authentication)

#### Create Event

```javascript
POST /api/calendar/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sunday Service",
  "description": "Join us for worship and fellowship",
  "location": "123 Church St, City",
  "startDateTime": "2024-01-01T10:00:00",
  "endDateTime": "2024-01-01T12:00:00",
  "timeZone": "America/New_York",
  "reminders": [
    { "method": "email", "minutes": 1440 },
    { "method": "popup", "minutes": 60 }
  ]
}

Response:
{
  "success": true,
  "event": { ... },
  "message": "Event created successfully"
}
```

#### Update Event

```javascript
PUT /api/calendar/events/[eventId]
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  // ... other fields
}
```

#### Delete Event

```javascript
DELETE /api/calendar/events/[eventId]
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### Get Event RSVPs

```javascript
GET /api/admin/calendar/rsvps/[eventId]
Authorization: Bearer <token>

Response:
{
  "success": true,
  "rsvps": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "numberOfGuests": 2,
      "status": "attending"
    }
  ],
  "count": 25,
  "total": 15
}
```

---

## 💻 **Frontend Usage Examples**

### Fetch and Display Events

```javascript
import { useState, useEffect } from "react";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendar/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{new Date(event.start).toLocaleString()}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}
```

### Submit RSVP

```javascript
async function handleRsvp(eventId, eventTitle, formData) {
  const response = await fetch("/api/calendar/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId,
      eventTitle,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      numberOfGuests: formData.guests,
      notes: formData.notes,
    }),
  });

  const data = await response.json();

  if (data.success) {
    alert("RSVP submitted successfully!");
  } else {
    alert("Error: " + data.error);
  }
}
```

### Embed Calendar

```javascript
function CalendarEmbed() {
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  const embedUrl = `https://calendar.google.com/calendar/embed?src=${calendarId}&mode=AGENDA`;

  return (
    <iframe
      src={embedUrl}
      style={{ border: 0 }}
      width="800"
      height="600"
      frameBorder="0"
      scrolling="no"
    />
  );
}
```

---

## 🎨 **Color Codes for Events**

You can customize event colors using `colorId`:

- `1` - Lavender
- `2` - Sage
- `3` - Grape
- `4` - Flamingo
- `5` - Banana
- `6` - Tangerine
- `7` - Peacock
- `8` - Graphite
- `9` - Blueberry (default)
- `10` - Basil
- `11` - Tomato

---

## 🔔 **Reminder Configuration**

### Default Reminders

```javascript
reminders: [
  { method: "email", minutes: 1440 }, // 1 day before
  { method: "popup", minutes: 60 }, // 1 hour before
];
```

### Custom Reminders

```javascript
reminders: [
  { method: "email", minutes: 10080 }, // 1 week
  { method: "email", minutes: 1440 }, // 1 day
  { method: "popup", minutes: 60 }, // 1 hour
];
```

---

## 📊 **Database Schema (RSVP)**

RSVPs are stored in MongoDB (lightweight):

```javascript
{
  eventId: String,          // Google Calendar Event ID
  eventTitle: String,       // Event name
  name: String,             // Attendee name
  email: String,            // Attendee email
  phone: String,            // Optional phone
  numberOfGuests: Number,   // Including the person
  status: String,           // attending, maybe, not_attending
  notes: String,            // Optional notes
  emailNotification: Boolean,
  reminderSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 **Security Notes**

1. **Service Account Key**: Never commit to git
2. **Environment Variables**: Use Vercel environment variables for production
3. **Admin Routes**: Always use `authMiddleware` for protected endpoints
4. **RSVP Data**: Store minimal data (name, email, count)

---

## 🎯 **Next Steps**

1. ✅ Create admin UI for event management
2. ✅ Build events page with embedded calendar
3. ✅ Add RSVP forms to event details
4. ✅ Create email notifications for RSVPs
5. ✅ Add "Add to Calendar" buttons

---

## 📚 **Files Created**

- `src/utils/googleCalendar.js` - Calendar utility functions
- `src/pages/api/calendar/events.js` - Events list/create API
- `src/pages/api/calendar/events/[id].js` - Single event API
- `src/pages/api/calendar/rsvp.js` - RSVP submission API
- `src/pages/api/admin/calendar/rsvps/[eventId].js` - Admin RSVP view
- `models/EventRsvp.js` - RSVP database model

---

## 🐛 **Troubleshooting**

### "Invalid credentials" error

- Check if `GOOGLE_PRIVATE_KEY` has proper `\n` formatting
- Verify service account email is correct

### "Calendar not found"

- Verify `GOOGLE_CALENDAR_ID` is correct
- Check if calendar is shared with service account

### Events not showing

- Ensure calendar is public or properly shared
- Check if events have future dates

### RSVP not working

- Verify MongoDB connection
- Check if EventRsvp model is properly imported

---

## 💰 **Cost Savings**

**Before (Self-hosted)**:

- Database storage: $10-50/month
- Email service: $20-100/month
- Server resources: $20+/month

**After (Google Calendar)**:

- Google Calendar API: **$0/month** ✨
- Only store RSVPs (minimal data): < $1/month

**Total Savings**: ~$50-170/month! 🎉

---

## 📖 **Additional Resources**

- Full setup guide: `GOOGLE_CALENDAR_SETUP.md`
- Google Calendar API Docs: https://developers.google.com/calendar
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction


