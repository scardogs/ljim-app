/**
 * Calendar Events API
 * GET /api/calendar/events - List upcoming events
 * POST /api/calendar/events - Create new event (admin only)
 */

import {
  listUpcomingEvents,
  createEvent,
  formatEvent,
} from "../../../utils/googleCalendar";
import { authMiddleware } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const maxResults = parseInt(req.query.maxResults) || 50;
      const events = await listUpcomingEvents(maxResults);
      const formattedEvents = events.map(formatEvent);

      return res.status(200).json({
        success: true,
        events: formattedEvents,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch events",
      });
    }
  }

  if (req.method === "POST") {
    // Require authentication for creating events
    const authResult = authMiddleware(req);
    if (!authResult.valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const eventData = req.body;

      // Validate required fields
      if (
        !eventData.title ||
        !eventData.startDateTime ||
        !eventData.endDateTime
      ) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: title, startDateTime, endDateTime",
        });
      }

      const createdEvent = await createEvent(eventData);
      const formattedEvent = formatEvent(createdEvent);

      return res.status(201).json({
        success: true,
        event: formattedEvent,
        message: "Event created successfully",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create event",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
