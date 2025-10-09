/**
 * Bible Settings Model
 * Stores configuration for Bible features
 */

import mongoose from "mongoose";

const BibleSettingsSchema = new mongoose.Schema(
  {
    // Featured verses for rotation
    featuredVerses: [
      {
        reference: {
          type: String,
          required: true,
        },
        translation: {
          type: String,
          default: "kjv",
        },
        category: {
          type: String,
          enum: [
            "inspirational",
            "comfort",
            "guidance",
            "faith",
            "love",
            "hope",
            "peace",
          ],
          default: "inspirational",
        },
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Default translation
    defaultTranslation: {
      type: String,
      default: "kjv",
      enum: ["kjv", "web", "oeb-us", "clementine", "almeida", "rccv"],
    },

    // Display settings
    displaySettings: {
      showVerseOfTheDay: {
        type: Boolean,
        default: true,
      },
      showBiblePageLink: {
        type: Boolean,
        default: true,
      },
      enableShareFeature: {
        type: Boolean,
        default: true,
      },
      enableCopyFeature: {
        type: Boolean,
        default: true,
      },
      compactMode: {
        type: Boolean,
        default: false,
      },
    },

    // Page content
    pageContent: {
      pageTitle: {
        type: String,
        default: "The Holy Bible",
      },
      pageSubtitle: {
        type: String,
        default:
          "Explore God's Word, find inspiration, and strengthen your faith through Scripture",
      },
      verseOfTheDayTitle: {
        type: String,
        default: "Verse of the Day",
      },
      searchSectionTitle: {
        type: String,
        default: "Bible Search",
      },
      searchPlaceholder: {
        type: String,
        default: "Enter reference (e.g., John 3:16, Psalm 23:1-6)",
      },
    },

    // Quick search suggestions
    quickSearches: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
BibleSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    // Create default settings
    settings = await this.create({
      featuredVerses: [
        { reference: "John 3:16", translation: "kjv", category: "love" },
        {
          reference: "Philippians 4:13",
          translation: "kjv",
          category: "faith",
        },
        { reference: "Jeremiah 29:11", translation: "kjv", category: "hope" },
        {
          reference: "Proverbs 3:5-6",
          translation: "kjv",
          category: "guidance",
        },
        { reference: "Romans 8:28", translation: "kjv", category: "comfort" },
        { reference: "Isaiah 41:10", translation: "kjv", category: "peace" },
        { reference: "Psalm 23:1-4", translation: "kjv", category: "comfort" },
      ],
      quickSearches: [
        "John 3:16",
        "Psalm 23",
        "Philippians 4:13",
        "Romans 8:28",
        "Jeremiah 29:11",
      ],
    });
  }

  return settings;
};

export default mongoose.models.BibleSettings ||
  mongoose.model("BibleSettings", BibleSettingsSchema);
