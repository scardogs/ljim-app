/**
 * Bible API Utility Functions
 * Using multiple free Bible APIs for redundancy
 */

// Primary API: Bible API (https://bible-api.com/)
const BIBLE_API_BASE = "https://bible-api.com";

// Secondary API: Bible.org Labs API
const BIBLE_ORG_API = "https://labs.bible.org/api";

/**
 * Fetch a specific Bible verse or passage
 * @param {string} reference - Bible reference (e.g., "John 3:16", "Psalm 23:1-6")
 * @param {string} translation - Bible translation (default: "kjv")
 * @returns {Promise<Object>} Verse data
 */
export async function fetchVerse(reference, translation = "kjv") {
  try {
    const encodedRef = encodeURIComponent(reference);
    const url = `${BIBLE_API_BASE}/${encodedRef}?translation=${translation}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch verse: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      reference: data.reference,
      verses: data.verses,
      text: data.text,
      translation: data.translation_name || translation.toUpperCase(),
      translationId: data.translation_id || translation,
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    throw error;
  }
}

/**
 * Fetch verse of the day (random inspirational verse)
 * @returns {Promise<Object>} Verse data
 */
export async function fetchVerseOfTheDay() {
  // Curated list of popular inspirational verses
  const inspirationalVerses = [
    "John 3:16",
    "Philippians 4:13",
    "Jeremiah 29:11",
    "Proverbs 3:5-6",
    "Romans 8:28",
    "Isaiah 41:10",
    "Psalm 23:1-4",
    "Matthew 11:28-30",
    "2 Corinthians 12:9",
    "Joshua 1:9",
    "Psalm 46:1",
    "Romans 12:2",
    "1 Corinthians 10:13",
    "Galatians 5:22-23",
    "Ephesians 2:8-9",
    "Colossians 3:23",
    "Hebrews 11:1",
    "James 1:2-4",
    "1 Peter 5:7",
    "1 John 4:19",
    "Psalm 91:1-2",
    "Isaiah 40:31",
    "Matthew 6:33",
    "Romans 8:38-39",
    "Philippians 4:6-7",
  ];

  // Get verse based on day of year for consistency throughout the day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const verseIndex = dayOfYear % inspirationalVerses.length;
  const selectedVerse = inspirationalVerses[verseIndex];

  return await fetchVerse(selectedVerse);
}

/**
 * Search for verses containing specific keywords
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export async function searchVerses(query) {
  try {
    // Using Bible.org API for search (returns random verse with query)
    const encodedQuery = encodeURIComponent(query);
    const url = `${BIBLE_ORG_API}/?passage=random&type=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      results: data,
      query: query,
    };
  } catch (error) {
    console.error("Error searching verses:", error);
    throw error;
  }
}

/**
 * Get random verse
 * @returns {Promise<Object>} Random verse data
 */
export async function fetchRandomVerse() {
  try {
    const response = await fetch(`${BIBLE_ORG_API}/?passage=random&type=json`);

    if (!response.ok) {
      // Fallback to verse of the day
      return await fetchVerseOfTheDay();
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return {
        reference:
          data[0].bookname + " " + data[0].chapter + ":" + data[0].verse,
        text: data[0].text,
        translation: "WEB",
      };
    }

    // Fallback
    return await fetchVerseOfTheDay();
  } catch (error) {
    console.error("Error fetching random verse:", error);
    // Fallback to verse of the day
    return await fetchVerseOfTheDay();
  }
}

/**
 * Parse Bible reference to validate format
 * @param {string} reference - Bible reference
 * @returns {Object} Parsed reference details
 */
export function parseReference(reference) {
  // Basic parsing - can be enhanced
  const pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?(?:-(\d+))?$/;
  const match = reference.match(pattern);

  if (!match) {
    return null;
  }

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verseStart: match[3] ? parseInt(match[3]) : null,
    verseEnd: match[4] ? parseInt(match[4]) : null,
    isValid: true,
  };
}

/**
 * Available Bible translations
 */
export const BIBLE_TRANSLATIONS = [
  { id: "kjv", name: "King James Version (KJV)" },
  { id: "web", name: "World English Bible (WEB)" },
  { id: "oeb-us", name: "Open English Bible, US Edition" },
  { id: "clementine", name: "Clementine Latin Vulgate" },
  { id: "almeida", name: "João Ferreira de Almeida" },
  { id: "rccv", name: "Romanian Corrected Cornilescu Version" },
];

/**
 * Get translation name by ID
 * @param {string} translationId
 * @returns {string}
 */
export function getTranslationName(translationId) {
  const translation = BIBLE_TRANSLATIONS.find((t) => t.id === translationId);
  return translation ? translation.name : translationId.toUpperCase();
}
