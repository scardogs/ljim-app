/**
 * Event RSVP Model
 * Tracks user RSVPs for Google Calendar events
 */

import mongoose from "mongoose";

const EventRsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    numberOfGuests: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["attending", "maybe", "not_attending"],
      default: "attending",
    },
    notes: {
      type: String,
      trim: true,
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate RSVPs
EventRsvpSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Static method to get RSVP count for an event
EventRsvpSchema.statics.getEventRsvpCount = async function (eventId) {
  const result = await this.aggregate([
    { $match: { eventId, status: "attending" } },
    { $group: { _id: null, totalGuests: { $sum: "$numberOfGuests" } } },
  ]);
  return result.length > 0 ? result[0].totalGuests : 0;
};

// Static method to get all RSVPs for an event
EventRsvpSchema.statics.getEventRsvps = async function (eventId) {
  return this.find({ eventId }).sort({ createdAt: -1 });
};

// Static method to check if email already RSVP'd
EventRsvpSchema.statics.hasRsvp = async function (eventId, email) {
  const rsvp = await this.findOne({ eventId, email });
  return !!rsvp;
};

export default mongoose.models.EventRsvp ||
  mongoose.model("EventRsvp", EventRsvpSchema);


