/**
 * Admin RSVP Management API
 * GET /api/admin/calendar/rsvps/[eventId] - Get all RSVPs for event (admin only)
 */

import connectDB from "../../../../../lib/mongodb";
import EventRsvp from "../../../../../../models/EventRsvp";
import { authMiddleware } from "../../../../../utils/auth";

export default async function handler(req, res) {
  await connectDB();

  // Require authentication
  const authResult = authMiddleware(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { eventId } = req.query;

  if (req.method === "GET") {
    try {
      const rsvps = await EventRsvp.getEventRsvps(eventId);
      const count = await EventRsvp.getEventRsvpCount(eventId);

      return res.status(200).json({
        success: true,
        rsvps,
        count,
        total: rsvps.length,
      });
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch RSVPs",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
