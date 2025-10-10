/**
 * Single Event API
 * GET /api/calendar/events/[id] - Get event details
 * PUT /api/calendar/events/[id] - Update event (admin only)
 * DELETE /api/calendar/events/[id] - Delete event (admin only)
 */

import {
  getEvent,
  updateEvent,
  deleteEvent,
  formatEvent,
} from "../../../../utils/googleCalendar";
import { authMiddleware } from "../../../../utils/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const event = await getEvent(id);
      const formattedEvent = formatEvent(event);

      return res.status(200).json({
        success: true,
        event: formattedEvent,
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }
  }

  if (req.method === "PUT") {
    // Require authentication
    const authResult = authMiddleware(req);
    if (!authResult.valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const eventData = req.body;
      const updatedEvent = await updateEvent(id, eventData);
      const formattedEvent = formatEvent(updatedEvent);

      return res.status(200).json({
        success: true,
        event: formattedEvent,
        message: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update event",
      });
    }
  }

  if (req.method === "DELETE") {
    // Require authentication
    const authResult = authMiddleware(req);
    if (!authResult.valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await deleteEvent(id);

      return res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete event",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}



