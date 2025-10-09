/**
 * Bible Verse API Route
 * GET /api/bible/verse?reference=John+3:16&translation=kjv
 */

import { fetchVerse } from "../../../utils/bibleApi";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reference, translation = "kjv" } = req.query;

    if (!reference) {
      return res.status(400).json({ error: "Reference parameter is required" });
    }

    const verseData = await fetchVerse(reference, translation);

    res.status(200).json({
      success: true,
      data: verseData,
    });
  } catch (error) {
    console.error("Bible verse API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch Bible verse",
    });
  }
}
