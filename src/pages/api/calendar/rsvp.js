/**
 * Event RSVP API
 * POST /api/calendar/rsvp - Submit RSVP
 * GET /api/calendar/rsvp?eventId=xxx - Get RSVP count for event
 */

import connectDB from "../../../lib/mongodb";
import EventRsvp from "../../../../models/EventRsvp";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { eventId } = req.query;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: "Event ID required",
        });
      }

      const count = await EventRsvp.getEventRsvpCount(eventId);

      return res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Error fetching RSVP count:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch RSVP count",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { eventId, eventTitle, name, email, phone, numberOfGuests, notes } =
        req.body;

      // Validate required fields
      if (!eventId || !eventTitle || !name || !email) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: eventId, eventTitle, name, email",
        });
      }

      // Check if already RSVP'd
      const existingRsvp = await EventRsvp.findOne({ eventId, email });

      if (existingRsvp) {
        // Update existing RSVP
        existingRsvp.name = name;
        existingRsvp.phone = phone;
        existingRsvp.numberOfGuests = numberOfGuests || 1;
        existingRsvp.notes = notes;
        existingRsvp.status = "attending";

        await existingRsvp.save();

        return res.status(200).json({
          success: true,
          message: "RSVP updated successfully",
          rsvp: existingRsvp,
        });
      }

      // Create new RSVP
      const rsvp = await EventRsvp.create({
        eventId,
        eventTitle,
        name,
        email,
        phone,
        numberOfGuests: numberOfGuests || 1,
        notes,
        status: "attending",
      });

      return res.status(201).json({
        success: true,
        message: "RSVP submitted successfully",
        rsvp,
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "You have already RSVP'd for this event",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to submit RSVP",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
