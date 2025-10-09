/**
 * Random Bible Verse API Route
 * GET /api/bible/random
 */

import { fetchRandomVerse } from "../../../utils/bibleApi";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const verseData = await fetchRandomVerse();

    res.status(200).json({
      success: true,
      data: verseData,
    });
  } catch (error) {
    console.error("Random verse API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch random verse",
    });
  }
}
