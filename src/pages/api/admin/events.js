import connectToDatabase from "../../../lib/mongodb";
import Event from "../../../../models/Event";
import { authMiddleware } from "../../../utils/auth";
import {
  deleteImageFile,
  deleteOldImageIfChanged,
} from "../../../utils/imageCleanup";

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

      // Get the old event to check for image changes
      const oldEvent = await Event.findById(_id);

      if (oldEvent && oldEvent.image && updates.image) {
        // Delete old image if it was changed
        deleteOldImageIfChanged(oldEvent.image, updates.image);
      }

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

      // Get the event first to delete its image
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Delete the event's image if it exists
      if (event.image) {
        deleteImageFile(event.image);
      }

      // Now delete the event
      await Event.findByIdAndDelete(id);

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
