/**
 * Verse of the Day API Route
 * GET /api/bible/verse-of-the-day
 */

import { fetchVerseOfTheDay } from "../../../utils/bibleApi";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const verseData = await fetchVerseOfTheDay();

    res.status(200).json({
      success: true,
      data: verseData,
    });
  } catch (error) {
    console.error("Verse of the day API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch verse of the day",
    });
  }
}
