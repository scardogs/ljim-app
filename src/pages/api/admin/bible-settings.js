/**
 * Bible Settings Admin API
 * GET /api/admin/bible-settings - Get Bible settings
 * PUT /api/admin/bible-settings - Update Bible settings
 */

import connectDB from "../../../lib/mongodb";
import BibleSettings from "../../../../models/BibleSettings";
import { authMiddleware } from "../../../utils/auth";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const settings = await BibleSettings.getSettings();
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error fetching Bible settings:", error);
      return res.status(500).json({ error: "Failed to fetch Bible settings" });
    }
  }

  if (req.method === "PUT") {
    // Require authentication for updates
    const authResult = authMiddleware(req);
    if (!authResult.valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const updateData = req.body;

      let settings = await BibleSettings.findOne();

      if (!settings) {
        settings = await BibleSettings.create(updateData);
      } else {
        settings = await BibleSettings.findOneAndUpdate({}, updateData, {
          new: true,
          runValidators: true,
        });
      }

      return res.status(200).json({
        message: "Bible settings updated successfully",
        settings,
      });
    } catch (error) {
      console.error("Error updating Bible settings:", error);
      return res.status(500).json({ error: "Failed to update Bible settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
