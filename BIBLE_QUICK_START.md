# 📖 Bible Features - Quick Start Guide

## What You Get

✅ **Verse of the Day** - Automatic daily inspirational verses  
✅ **Bible Search** - Search any verse in multiple translations  
✅ **Dedicated Bible Page** - Full-featured Bible reading experience  
✅ **Admin Controls** - Manage all Bible settings from dashboard  
✅ **Chat Integration** - AI chat enhanced with Bible knowledge  
✅ **Zero Database Usage** - All verses from free external APIs

---

## 🚀 5-Minute Setup

### Step 1: Bible Page is Already Live! ✅

Visit: **`http://localhost:3000/bible`**

The Bible page is ready with:

- Verse of the Day
- Bible verse search
- Multiple translations
- Share & copy features

### Step 2: Homepage Already Shows Daily Verse ✅

Your homepage (`/`) now includes the Verse of the Day widget automatically!

### Step 3: Configure Admin Settings (Optional)

1. Login to admin: `/admin`
2. Click **"Bible Settings"** in sidebar
3. Customize:
   - Featured verses for rotation
   - Default translation
   - Page titles and text
   - Quick search suggestions
4. Click **"Save Settings"**

---

## 🎨 Using Bible Components

### Add Verse Widget Anywhere

```jsx
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";

<VerseOfTheDay />;
```

### Add Bible Search Anywhere

```jsx
import BibleSearch from "../components/Bible-sections/BibleSearch";

<BibleSearch />;
```

---

## 🔌 API Usage

### Get Daily Verse

```javascript
fetch("/api/bible/verse-of-the-day")
  .then((res) => res.json())
  .then((data) => console.log(data.data));
```

### Search Specific Verse

```javascript
fetch("/api/bible/verse?reference=John+3:16&translation=kjv")
  .then((res) => res.json())
  .then((data) => console.log(data.data));
```

### Get Random Verse

```javascript
fetch("/api/bible/random")
  .then((res) => res.json())
  .then((data) => console.log(data.data));
```

---

## 🎯 Key Features

### 1. Verse of the Day

- **Location:** Homepage + `/bible`
- **Updates:** Daily (consistent throughout day)
- **Features:** Copy, share, refresh
- **Verses:** 25+ curated inspirational verses

### 2. Bible Search

- **Location:** `/bible` page
- **Search:** Any verse or passage
- **Translations:** 6+ available (KJV, WEB, etc.)
- **Quick Searches:** One-click popular verses

### 3. Admin Controls

- **Location:** Admin Dashboard → Bible Settings
- **Manage:** Featured verses, translations, display options
- **Customize:** Page content, quick searches
- **Real-time:** Changes apply immediately

### 4. Chat Integration

- **Location:** Chat widget (all pages)
- **Enhanced:** AI knows Bible verses
- **Smart:** Auto-quotes Scripture in responses
- **Translations:** Multiple Bible versions

---

## 📱 Available Translations

1. **KJV** - King James Version (default)
2. **WEB** - World English Bible
3. **OEB-US** - Open English Bible
4. **Clementine** - Latin Vulgate
5. **Almeida** - Portuguese
6. **RCCV** - Romanian

---

## 💡 Pro Tips

### Tip 1: Customize Featured Verses

Add your favorite verses to rotation in Admin → Bible Settings → Featured Verses

### Tip 2: Quick Searches

Set up quick search badges for your congregation's favorite verses

### Tip 3: Share on Social Media

Users can share daily verses directly to social media with one click

### Tip 4: Embed Anywhere

Use `<VerseOfTheDay compact={true} />` for smaller spaces

### Tip 5: API Integration

Build custom features using our Bible API endpoints

---

## 🔧 Troubleshooting

### Verse not loading?

- Check internet connection
- Try refreshing the page
- Verify API is accessible

### Settings not saving?

- Ensure you're logged in as admin
- Check all required fields are filled
- Refresh and try again

### Wrong verse showing?

- Daily verse updates at midnight
- Click refresh icon for new random verse
- Check admin settings for featured verses

---

## 📚 Available APIs

| Endpoint                         | Method | Purpose            |
| -------------------------------- | ------ | ------------------ |
| `/api/bible/verse-of-the-day`    | GET    | Get daily verse    |
| `/api/bible/verse?reference=...` | GET    | Get specific verse |
| `/api/bible/random`              | GET    | Get random verse   |
| `/api/admin/bible-settings`      | GET    | Get settings       |
| `/api/admin/bible-settings`      | PUT    | Update settings    |

---

## 🎉 What's Special?

### ✨ FREE Forever

- Uses free external APIs
- No database storage needed
- Perfect for MongoDB free tier

### ✨ Zero Maintenance

- APIs auto-update
- No verse database to manage
- Always accurate and current

### ✨ Feature-Rich

- Multiple translations
- Search any verse
- Share & copy
- Admin controls
- Chat integration

### ✨ User-Friendly

- Beautiful UI
- Mobile responsive
- Fast loading
- Intuitive navigation

---

## 📖 Example Usage

### Daily Devotional Widget

```jsx
// Add to any page
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";

function MyPage() {
  return (
    <div>
      <h1>Daily Devotional</h1>
      <VerseOfTheDay />
    </div>
  );
}
```

### Custom Verse Display

```jsx
import { useState, useEffect } from "react";

function FavoriteVerse() {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    fetch("/api/bible/verse?reference=Jeremiah+29:11")
      .then((r) => r.json())
      .then((d) => setVerse(d.data));
  }, []);

  return verse ? <p>{verse.text}</p> : <p>Loading...</p>;
}
```

---

## 🚀 Next Steps

1. **Explore** the Bible page (`/bible`)
2. **Customize** settings in admin panel
3. **Share** verses with your congregation
4. **Build** custom features with our API
5. **Read** full documentation in `BIBLE_API_GUIDE.md`

---

## 📞 Need Help?

- **Full Guide:** See `BIBLE_API_GUIDE.md`
- **API Docs:** Check endpoint documentation
- **Admin Help:** Login to admin panel for tooltips
- **Developer:** Contact John Michael Escarlan

---

**"Thy word is a lamp unto my feet, and a light unto my path."**  
_- Psalm 119:105 (KJV)_

---

**Built for LJIM - Lift Jesus International Ministries**
