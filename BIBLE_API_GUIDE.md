# 📖 Bible API Integration Guide

## Overview

This guide covers the comprehensive Bible API integration in your LJIM church website. The Bible features use **free external APIs** to provide Bible verses without storing them in MongoDB, saving database space and costs.

---

## ✅ Features Implemented

### 1. **Verse of the Day Widget**

- Displays a rotating inspirational verse daily
- 25+ curated inspirational verses
- Consistent verse throughout the day (changes daily)
- Copy, share, and refresh functionality
- Beautiful gradient design with animations
- Integrated on homepage

### 2. **Bible Search**

- Search any Bible verse or passage
- Support for multiple translations (KJV, WEB, etc.)
- Quick search suggestions
- Copy to clipboard
- Verse-by-verse display
- Reference validation

### 3. **Dedicated Bible Page**

- Full-featured Bible reading experience
- Verse of the Day section
- Bible search functionality
- Features showcase
- Inspirational quote section
- Accessible via navbar

### 4. **Admin Bible Settings**

- Manage featured verses for rotation
- Configure default translation
- Toggle display features
- Customize page content
- Add/remove quick searches
- Enable/disable sharing features

### 5. **Chat Integration**

- Enhanced AI chat with Bible knowledge
- Automatic Bible verse lookup
- Contextual Scripture responses
- Multiple translation support

---

## 🔌 API Endpoints

### Public Endpoints

#### Get Verse of the Day

```
GET /api/bible/verse-of-the-day
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reference": "John 3:16",
    "text": "For God so loved the world...",
    "translation": "King James Version",
    "translationId": "kjv",
    "verses": [...]
  }
}
```

#### Get Specific Verse

```
GET /api/bible/verse?reference=John+3:16&translation=kjv
```

**Parameters:**

- `reference` (required): Bible reference (e.g., "John 3:16", "Psalm 23:1-6")
- `translation` (optional): Translation ID (default: "kjv")

**Response:**

```json
{
  "success": true,
  "data": {
    "reference": "John 3:16",
    "text": "For God so loved the world...",
    "translation": "King James Version",
    "verses": [
      {
        "verse": 16,
        "text": "For God so loved the world..."
      }
    ]
  }
}
```

#### Get Random Verse

```
GET /api/bible/random
```

**Response:** Same format as verse endpoint

### Admin Endpoints

#### Get Bible Settings

```
GET /api/admin/bible-settings
```

**Response:**

```json
{
  "featuredVerses": [...],
  "defaultTranslation": "kjv",
  "displaySettings": {
    "showVerseOfTheDay": true,
    "showBiblePageLink": true,
    "enableShareFeature": true,
    "enableCopyFeature": true,
    "compactMode": false
  },
  "pageContent": {
    "pageTitle": "The Holy Bible",
    "pageSubtitle": "...",
    "verseOfTheDayTitle": "Verse of the Day"
  },
  "quickSearches": [...]
}
```

#### Update Bible Settings (Requires Authentication)

```
PUT /api/admin/bible-settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "featuredVerses": [...],
  "defaultTranslation": "kjv",
  ...
}
```

---

## 📁 File Structure

```
ljim-app/
├── models/
│   └── BibleSettings.js              # NEW - Bible settings model
│
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── BibleSettingsEditor.js    # NEW - Admin settings
│   │   │
│   │   └── Bible-sections/
│   │       ├── VerseOfTheDay.js          # NEW - Daily verse widget
│   │       └── BibleSearch.js            # NEW - Search component
│   │
│   ├── pages/
│   │   ├── bible.js                      # NEW - Bible page
│   │   │
│   │   └── api/
│   │       ├── bible/
│   │       │   ├── verse.js              # NEW - Get specific verse
│   │       │   ├── verse-of-the-day.js   # NEW - Daily verse
│   │       │   └── random.js             # NEW - Random verse
│   │       │
│   │       └── admin/
│   │           └── bible-settings.js     # NEW - Settings API
│   │
│   └── utils/
│       └── bibleApi.js                   # NEW - Bible API utilities
│
├── public/
│   └── systemprompt.txt                  # UPDATED - Chat enhancement
│
└── BIBLE_API_GUIDE.md                    # NEW - This documentation
```

---

## 🎨 Components Usage

### VerseOfTheDay Component

```jsx
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";

// Full version (default)
<VerseOfTheDay showTitle={true} compact={false} />

// Compact version
<VerseOfTheDay showTitle={false} compact={true} />
```

**Props:**

- `showTitle` (boolean): Show/hide "Verse of the Day" heading
- `compact` (boolean): Compact mode with reduced padding

**Features:**

- Copy verse to clipboard
- Share verse (native share API or clipboard fallback)
- Refresh to get random verse
- Beautiful gradient background
- Responsive design

### BibleSearch Component

```jsx
import BibleSearch from "../components/Bible-sections/BibleSearch";

<BibleSearch />;
```

**Features:**

- Text input for verse reference
- Translation selector
- Quick search badges
- Verse-by-verse display
- Copy functionality
- Error handling

---

## 🔧 Utility Functions

### fetchVerse(reference, translation)

Fetch a specific Bible verse or passage.

```javascript
import { fetchVerse } from "../utils/bibleApi";

const verse = await fetchVerse("John 3:16", "kjv");
// Returns: { reference, text, verses, translation, translationId }
```

### fetchVerseOfTheDay()

Get the daily verse (consistent throughout the day).

```javascript
import { fetchVerseOfTheDay } from "../utils/bibleApi";

const verse = await fetchVerseOfTheDay();
```

### fetchRandomVerse()

Get a random Bible verse.

```javascript
import { fetchRandomVerse } from "../utils/bibleApi";

const verse = await fetchRandomVerse();
```

### parseReference(reference)

Validate and parse Bible reference.

```javascript
import { parseReference } from "../utils/bibleApi";

const parsed = parseReference("John 3:16");
// Returns: { book: "John", chapter: 3, verseStart: 16, verseEnd: null, isValid: true }
```

---

## 📚 Available Translations

The following Bible translations are supported:

| ID           | Name                                  |
| ------------ | ------------------------------------- |
| `kjv`        | King James Version (KJV)              |
| `web`        | World English Bible (WEB)             |
| `oeb-us`     | Open English Bible, US Edition        |
| `clementine` | Clementine Latin Vulgate              |
| `almeida`    | João Ferreira de Almeida              |
| `rccv`       | Romanian Corrected Cornilescu Version |

Access in code:

```javascript
import { BIBLE_TRANSLATIONS, getTranslationName } from "../utils/bibleApi";

console.log(BIBLE_TRANSLATIONS);
// [{ id: "kjv", name: "King James Version (KJV)" }, ...]

const name = getTranslationName("kjv");
// Returns: "King James Version (KJV)"
```

---

## ⚙️ Admin Configuration

### Accessing Bible Settings

1. Login to admin panel (`/admin`)
2. Click **"Bible Settings"** in sidebar
3. Configure settings using the accordion interface

### Settings Sections

#### 1. Page Content

- Page title and subtitle
- Verse of the Day title
- Search section title
- Search placeholder text

#### 2. Display Settings

- Default translation
- Show/hide Verse of the Day
- Show/hide Bible page link
- Enable/disable share feature
- Enable/disable copy feature
- Compact mode toggle

#### 3. Featured Verses

- Add/edit/delete featured verses
- Set reference and translation
- Categorize verses (inspirational, comfort, guidance, etc.)
- Enable/disable individual verses

#### 4. Quick Searches

- Add popular verse shortcuts
- Displayed as clickable badges
- Easy access for users

---

## 🌐 External APIs Used

### 1. Bible API (bible-api.com)

**Primary API for verse lookups**

- **URL:** https://bible-api.com
- **Cost:** FREE
- **Rate Limit:** None specified
- **Features:** Multiple translations, passage support
- **Usage:** Main verse fetching

### 2. Bible.org Labs API

**Secondary API for random verses**

- **URL:** https://labs.bible.org/api
- **Cost:** FREE
- **Rate Limit:** None specified
- **Features:** Random verses, JSON format
- **Usage:** Random verse generation

---

## 💾 Database Model

### BibleSettings Schema

```javascript
{
  featuredVerses: [
    {
      reference: String,        // e.g., "John 3:16"
      translation: String,      // e.g., "kjv"
      category: String,         // "inspirational", "comfort", etc.
      enabled: Boolean          // true/false
    }
  ],
  defaultTranslation: String,   // Default: "kjv"
  displaySettings: {
    showVerseOfTheDay: Boolean,
    showBiblePageLink: Boolean,
    enableShareFeature: Boolean,
    enableCopyFeature: Boolean,
    compactMode: Boolean
  },
  pageContent: {
    pageTitle: String,
    pageSubtitle: String,
    verseOfTheDayTitle: String,
    searchSectionTitle: String,
    searchPlaceholder: String
  },
  quickSearches: [String],
  timestamps: true              // createdAt, updatedAt
}
```

### Static Methods

```javascript
// Get settings (creates default if doesn't exist)
const settings = await BibleSettings.getSettings();
```

---

## 🚀 Usage Examples

### Example 1: Add Verse Widget to Any Page

```jsx
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <VerseOfTheDay />
    </div>
  );
}
```

### Example 2: Fetch Custom Verse

```jsx
import { useState, useEffect } from "react";

function CustomVerse() {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    fetch("/api/bible/verse?reference=Philippians+4:13&translation=kjv")
      .then((res) => res.json())
      .then((data) => setVerse(data.data));
  }, []);

  return (
    <div>
      {verse && (
        <>
          <p>{verse.text}</p>
          <p>- {verse.reference}</p>
        </>
      )}
    </div>
  );
}
```

### Example 3: Admin Settings Update

```javascript
const updateBibleSettings = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch("/api/admin/bible-settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      defaultTranslation: "web",
      displaySettings: {
        showVerseOfTheDay: true,
        compactMode: false,
      },
    }),
  });

  const result = await response.json();
  console.log(result.message); // "Bible settings updated successfully"
};
```

---

## 🎯 Benefits of API Integration

### 1. **Zero Database Storage**

- No Bible verses stored in MongoDB
- Saves database space
- Reduces MongoDB Atlas costs
- Perfect for free tier usage

### 2. **Always Up-to-Date**

- Verses fetched from authoritative sources
- No need to maintain Bible text database
- Automatic updates from API providers

### 3. **Multiple Translations**

- Access to 6+ translations
- Easy to add more translations
- No storage overhead

### 4. **Scalability**

- API handles all the load
- No database queries for verses
- Unlimited verse lookups

### 5. **Reliability**

- Multiple API fallbacks
- Error handling built-in
- Graceful degradation

---

## 🔒 Security Considerations

### API Keys

- Bible APIs used are **public and free**
- No API keys required
- No authentication needed
- Safe for client-side calls

### Rate Limiting

- No strict rate limits on free APIs
- Implement client-side caching if needed
- Consider adding request debouncing

### Data Validation

- All user input sanitized
- Reference format validation
- Error handling for invalid references

---

## 🐛 Troubleshooting

### Issue: Verse not loading

**Solution:**

1. Check internet connection
2. Verify API is accessible
3. Check browser console for errors
4. Try different translation

### Issue: "Failed to fetch verse"

**Solution:**

1. Verify reference format (e.g., "John 3:16")
2. Check if book name is spelled correctly
3. Ensure chapter/verse numbers are valid
4. Try a simpler reference

### Issue: Admin settings not saving

**Solution:**

1. Check if user is authenticated
2. Verify admin token is valid
3. Check browser console for errors
4. Ensure all required fields are filled

---

## 📈 Future Enhancements

### Potential Features to Add

1. **Reading Plans**

   - Daily Bible reading schedules
   - Track reading progress
   - Bookmark verses

2. **Verse Highlighting**

   - User can highlight verses
   - Save favorite verses
   - Create verse collections

3. **Audio Bible**

   - Integrate audio Bible API
   - Listen to verses
   - Multiple voice options

4. **Cross-References**

   - Show related verses
   - Verse connections
   - Topic-based grouping

5. **Study Notes**

   - Add personal notes to verses
   - Share notes with community
   - Study groups

6. **Verse Images**

   - Generate shareable verse images
   - Custom backgrounds
   - Social media ready

7. **Email Subscriptions**
   - Daily verse emails
   - Weekly devotionals
   - Prayer reminders

---

## 📞 Support

For questions or issues:

- Check this documentation
- Review code comments
- Test in development environment
- Contact: John Michael Escarlan (Developer)

---

## 📝 Version History

### Version 1.0 (Initial Release)

- Verse of the Day widget
- Bible search functionality
- Dedicated Bible page
- Admin settings panel
- Multiple translation support
- Chat integration
- Homepage integration

---

**Built with ❤️ for LJIM - Lift Jesus International Ministries**

_"Thy word is a lamp unto my feet, and a light unto my path." - Psalm 119:105 (KJV)_
