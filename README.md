# 🙏 LJIM Church Website - Lift Jesus International Ministries

A modern, full-featured church website built with Next.js 15, React 19, and MongoDB. Features a comprehensive admin panel, Bible integration, AI chat, and much more.

---

## ✨ Key Features

### 📖 **NEW: Bible API Integration**

- **Verse of the Day** - Daily inspirational verses with sharing
- **Bible Search** - Search any verse in 6+ translations
- **Dedicated Bible Page** - Full Bible reading experience
- **Zero Database Usage** - Verses from free external APIs
- **Admin Controls** - Manage featured verses and settings
- **Quick Start:** See [BIBLE_QUICK_START.md](BIBLE_QUICK_START.md)
- **Full Guide:** See [BIBLE_API_GUIDE.md](BIBLE_API_GUIDE.md)

### 🔐 Admin Module

- Secure authentication with JWT
- User management with role-based access
- Registration approval system
- Content management for all pages
- Image upload and management
- Real-time content editing

### 🌐 Public Website

- Dynamic homepage with customizable sections
- About page with mission, vision, and team
- Events management and calendar
- Music lineup with lyrics and chords
- Prayer requests with moderation
- Online shop with products
- Contact page with forms
- AI-powered chat support

### 🤖 AI Chat Integration

- Gemini AI powered chatbot
- Bible knowledge and verse lookup
- Ministry information support
- Floating chat widget on all pages

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works!)
- Google Gemini API key (optional, for chat)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ljim-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Setup

Create `.env.local` in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_key_here

# Google Gemini API (optional)
GOOGLE_API_KEY=your_gemini_api_key

# Email (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Create First Admin Account

1. Visit `http://localhost:3000/register`
2. Fill in your details
3. Click "Register"
4. Login at `/login`
5. Access admin panel at `/admin`

---

## 📁 Project Structure

```
ljim-app/
├── models/                    # MongoDB/Mongoose models
│   ├── Admin.js              # Admin users
│   ├── BibleSettings.js      # Bible configuration (NEW)
│   ├── HomepageContent.js    # Homepage data
│   ├── Event.js              # Events
│   ├── PrayerRequest.js      # Prayer requests
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── admin/            # Admin panel components
│   │   ├── Bible-sections/   # Bible components (NEW)
│   │   │   ├── VerseOfTheDay.js
│   │   │   └── BibleSearch.js
│   │   ├── Homepage-sections/
│   │   ├── Events-sections/
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   │   ├── bible/        # Bible API (NEW)
│   │   │   ├── admin/        # Admin APIs
│   │   │   ├── auth/         # Authentication
│   │   │   └── ...
│   │   ├── bible.js          # Bible page (NEW)
│   │   ├── index.js          # Homepage
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── auth.js           # JWT utilities
│   │   ├── bibleApi.js       # Bible API utilities (NEW)
│   │   └── ...
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/               # Uploaded images
│   └── systemprompt.txt      # AI chat configuration
│
└── Documentation/
    ├── BIBLE_API_GUIDE.md         # Bible features guide (NEW)
    ├── BIBLE_QUICK_START.md       # Bible quick start (NEW)
    ├── ADMIN_SETUP_GUIDE.md       # Admin setup
    ├── USER_MANAGEMENT_GUIDE.md   # User management
    └── ...
```

---

## 📚 Documentation

### Quick Start Guides

- [Bible Features Quick Start](BIBLE_QUICK_START.md) - **NEW**
- [Admin Quick Start](QUICK_START_ADMIN.md)
- [Registration Approval](QUICK_START_REGISTRATION_APPROVAL.md)

### Complete Guides

- [Bible API Integration Guide](BIBLE_API_GUIDE.md) - **NEW**
- [Admin Setup Guide](ADMIN_SETUP_GUIDE.md)
- [Admin Module Overview](ADMIN_MODULE_OVERVIEW.md)
- [User Management](USER_MANAGEMENT_COMPLETE_GUIDE.md)
- [Registration Approval](REGISTRATION_APPROVAL_GUIDE.md)
- [Image Upload Guide](IMAGE_UPLOAD_GUIDE.md)
- [Email Setup](EMAIL_SETUP_GUIDE.md)
- [Vercel Deployment](VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🎯 Main Features

### Public Pages

- ✅ Homepage with dynamic sections
- ✅ About page
- ✅ **Bible page with verse search** (NEW)
- ✅ Music lineup with song management
- ✅ Events calendar
- ✅ Prayer requests wall
- ✅ Online shop
- ✅ Contact form
- ✅ AI chat support

### Admin Dashboard

- ✅ User management
- ✅ Registration approval system
- ✅ **Bible settings editor** (NEW)
- ✅ Homepage content editor
- ✅ Events management
- ✅ Music lineup editor
- ✅ Prayer request moderation
- ✅ Shop product management
- ✅ Image upload system
- ✅ Navbar customization

### Bible Features (NEW)

- ✅ Verse of the Day widget
- ✅ Bible verse search (6+ translations)
- ✅ Random verse generator
- ✅ Quick search suggestions
- ✅ Copy & share verses
- ✅ Admin verse configuration
- ✅ Chat integration
- ✅ Zero database usage

### API Integrations

- ✅ **Bible API (bible-api.com)** - FREE (NEW)
- ✅ **Bible.org Labs API** - FREE (NEW)
- ✅ Google Gemini AI - Chat support
- ✅ Email notifications (Nodemailer)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4
- **React:** 19.1.0
- **UI Library:** Chakra UI 2.10.9
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **AI:** Google Gemini API
- **Email:** Nodemailer
- **File Upload:** Formidable
- **PDF Generation:** jsPDF
- **Markdown:** React Markdown

---

## 📡 API Endpoints

### Bible APIs (NEW)

```
GET  /api/bible/verse-of-the-day       # Daily verse
GET  /api/bible/verse?reference=...    # Specific verse
GET  /api/bible/random                 # Random verse
GET  /api/admin/bible-settings         # Get settings
PUT  /api/admin/bible-settings         # Update settings (auth)
```

### Authentication

```
POST /api/auth/login                   # Admin login
POST /api/auth/register                # Admin registration
GET  /api/auth/verify                  # Verify token
POST /api/auth/registration-request    # Request access
POST /api/auth/complete-registration   # Complete registration
```

### Content Management

```
GET/PUT  /api/admin/homepage          # Homepage content
GET/PUT  /api/admin/about             # About page
GET/PUT  /api/admin/events            # Events
GET/PUT  /api/admin/give              # Give page
GET/PUT  /api/admin/shop              # Shop
GET/PUT  /api/admin/contact           # Contact
GET/PUT  /api/navbar/content          # Navbar
```

### Prayer Requests

```
GET     /api/prayer-requests          # Public requests
POST    /api/prayer-requests          # Submit request
GET/PUT /api/admin/prayer-requests    # Manage (admin)
```

### More

See [BIBLE_API_GUIDE.md](BIBLE_API_GUIDE.md) for complete API documentation.

---

## 🎨 Customization

### Add Bible Widget to Any Page

```jsx
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";

<VerseOfTheDay showTitle={true} compact={false} />;
```

### Fetch Custom Verse

```javascript
const verse = await fetch("/api/bible/verse?reference=John+3:16").then((r) =>
  r.json()
);
console.log(verse.data.text);
```

### Configure Bible Settings

1. Login to `/admin`
2. Go to "Bible Settings"
3. Add/edit featured verses
4. Set default translation
5. Customize page content
6. Save changes

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

See [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables on Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_API_KEY` (optional)
- `EMAIL_USER` (optional)
- `EMAIL_PASSWORD` (optional)

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected admin routes
- ✅ Registration approval system
- ✅ Role-based access control
- ✅ Input validation
- ✅ Secure file upload
- ✅ Email verification ready

---

## 📊 MongoDB Collections

1. **admins** - Admin users
2. **homepagecontents** - Homepage data
3. **biblesettings** - Bible configuration (NEW)
4. **aboutcontents** - About page
5. **events** - Church events
6. **prayerrequests** - Prayer requests
7. **shopcontents** - Shop products
8. **contactcontents** - Contact info
9. **songs** - Music lineup
10. **singers** - Worship leaders
11. **navbarcontents** - Navigation
12. **registrationrequests** - Access requests

---

## 💡 Pro Tips

1. **Use Free Tier:** MongoDB Atlas free tier (512MB) is sufficient
2. **Bible API:** Saves database space by using external APIs
3. **Image Management:** Upload to `/public/images/` folder
4. **Admin Access:** Approve registrations for team members
5. **Backup Data:** Regular MongoDB backups recommended
6. **Performance:** Use debounced inputs in admin panel
7. **SEO Ready:** Add meta tags for better search ranking

---

## 🆘 Troubleshooting

### Bible Verses Not Loading

- Check internet connection
- Verify external APIs are accessible
- Try different translation
- See [BIBLE_API_GUIDE.md](BIBLE_API_GUIDE.md)

### Admin Login Issues

- Clear browser cache
- Check MongoDB connection
- Verify JWT_SECRET is set
- See [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md)

### Database Connection Failed

- Check MONGODB_URI format
- Verify IP whitelist in Atlas
- Ensure password is URL-encoded
- See [ENV_SETUP.md](ENV_SETUP.md)

---

## 📞 Support

- **Documentation:** Check the guides in root directory
- **Issues:** Review troubleshooting sections
- **Developer:** John Michael Escarlan
- **Ministry:** LJIM - Lift Jesus International Ministries

---

## 🙏 About LJIM

**Lift Jesus International Ministries** is a Christ-centered global fellowship committed to spreading the message of salvation through faith in Jesus Christ.

**Founder:** Bishop Ed Dalisay Fernandez

**Mission:** Bring spiritual transformation worldwide, empower believers, and serve communities through meaningful outreach programs.

**Vision:** A world transformed by the Gospel, reflecting God's love, peace, and justice.

---

## 📝 License

This project is built for LJIM - Lift Jesus International Ministries.

---

## 🎉 What's New

### Version 2.0 - Bible Integration

- ✨ Verse of the Day widget
- ✨ Bible verse search (6+ translations)
- ✨ Dedicated Bible page
- ✨ Admin Bible settings
- ✨ Chat Bible integration
- ✨ Zero MongoDB storage for verses
- ✨ Free external API usage

---

**Built with ❤️ for spreading the Gospel**

_"Thy word is a lamp unto my feet, and a light unto my path." - Psalm 119:105 (KJV)_
