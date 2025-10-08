import connectToDatabase from "../../../lib/mongodb";
import Event from "../../../../models/Event";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      // Get all events, sorted by date (ascending - upcoming first)
      const events = await Event.find().sort({ date: 1 });
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  } else if (req.method === "POST") {
    try {
      const event = await Event.create(req.body);
      res.status(201).json({
        message: "Event created successfully",
        event,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  } else if (req.method === "PUT") {
    try {
      const { _id, ...updates } = req.body;
      const event = await Event.findByIdAndUpdate(_id, updates, {
        new: true,
        runValidators: true,
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(200).json({
        message: "Event updated successfully",
        event,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const event = await Event.findByIdAndDelete(id);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// For GET requests, allow public access. For POST/PUT/DELETE, require authentication
export default async function eventsHandler(req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  } else {
    return authMiddleware(handler)(req, res);
  }
}
