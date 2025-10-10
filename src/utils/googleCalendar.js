/**
 * Google Calendar API Utility
 * Server-side only - handles Google Calendar operations
 */

import { google } from "googleapis";

/**
 * Get authenticated Google Calendar client
 */
export function getCalendarClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    return google.calendar({ version: "v3", auth });
  } catch (error) {
    console.error("Error creating calendar client:", error);
    throw new Error("Failed to initialize Google Calendar");
  }
}

/**
 * Get calendar ID from environment
 */
export function getCalendarId() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID not configured");
  }
  return calendarId;
}

/**
 * List upcoming events
 */
export async function listUpcomingEvents(maxResults = 10) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error listing events:", error);
    throw error;
  }
}

/**
 * Get all events (past and future)
 */
export async function getAllEvents(timeMin = null, timeMax = null) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const params = {
      calendarId,
      singleEvents: true,
      orderBy: "startTime",
    };

    if (timeMin) params.timeMin = timeMin;
    if (timeMax) params.timeMax = timeMax;

    const response = await calendar.events.list(params);
    return response.data.items || [];
  } catch (error) {
    console.error("Error getting all events:", error);
    throw error;
  }
}

/**
 * Get single event by ID
 */
export async function getEvent(eventId) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    return response.data;
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
}

/**
 * Create new event
 */
export async function createEvent(eventData) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || "America/New_York",
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || "America/New_York",
      },
      reminders: {
        useDefault: false,
        overrides: eventData.reminders || [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 60 }, // 1 hour before
        ],
      },
      colorId: eventData.colorId || "9", // Default blue
    };

    // Add attendees if provided
    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map((email) => ({ email }));
    }

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
      sendUpdates: "all", // Send notifications to attendees
    });

    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Update existing event
 */
export async function updateEvent(eventId, eventData) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: eventData.timeZone || "America/New_York",
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: eventData.timeZone || "America/New_York",
      },
      reminders: {
        useDefault: false,
        overrides: eventData.reminders || [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
      colorId: eventData.colorId || "9",
    };

    if (eventData.attendees && eventData.attendees.length > 0) {
      event.attendees = eventData.attendees.map((email) => ({ email }));
    }

    const response = await calendar.events.update({
      calendarId,
      eventId,
      resource: event,
      sendUpdates: "all",
    });

    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

/**
 * Delete event
 */
export async function deleteEvent(eventId) {
  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: "all", // Notify attendees
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

/**
 * Format event for frontend
 */
export function formatEvent(event) {
  return {
    id: event.id,
    title: event.summary,
    description: event.description || "",
    location: event.location || "",
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    htmlLink: event.htmlLink,
    attendees: event.attendees || [],
    colorId: event.colorId,
    created: event.created,
    updated: event.updated,
  };
}

/**
 * Get calendar embed URL
 */
export function getCalendarEmbedUrl(options = {}) {
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  const {
    mode = "AGENDA",
    showTitle = 1,
    showNav = 1,
    showDate = 1,
    showPrint = 0,
    showTabs = 1,
    showCalendars = 0,
    showTz = 0,
    height = 600,
    wkst = 1,
    bgcolor = "%23ffffff",
    color = "%23616161",
  } = options;

  const params = new URLSearchParams({
    src: calendarId,
    mode,
    showTitle,
    showNav,
    showDate,
    showPrint,
    showTabs,
    showCalendars,
    showTz,
    height,
    wkst,
    bgcolor,
    color,
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

/**
 * Get "Add to Calendar" link
 */
export function getAddToCalendarLink(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatDateForGoogle(event.start)}/${formatDateForGoogle(
      event.end
    )}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Format date for Google Calendar link
 */
function formatDateForGoogle(dateString) {
  const date = new Date(dateString);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}



