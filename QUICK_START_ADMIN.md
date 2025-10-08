# 🚀 Quick Start Guide - Admin Module

## ⚡ 5-Minute Setup

### Step 1: Environment Variables (1 minute)

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

💡 **Tip**: You mentioned your MongoDB connection is in `config.env` under `ATLAS_URI`. Copy that value to `MONGODB_URI` in `.env.local`.

### Step 2: Start Development Server (30 seconds)

```bash
npm run dev
```

### Step 3: Create Admin Account (2 minutes)

1. Open browser: `http://localhost:3000`
2. Click **"Login"** button in navbar
3. Click **"Register here"** link
4. Fill in:
   - Name: Your Name
   - Email: admin@ljim.com
   - Password: (min 6 characters)
   - Confirm Password
5. Click **"Register"**
6. 🎉 You're automatically logged in!

### Step 4: Start Editing (1 minute)

1. You're now in the Admin Dashboard
2. Click **"Home Content"** in sidebar (should be selected by default)
3. Edit any field:
   - Hero Section
   - Main Content
   - Mission & Values
   - Ministries
   - Call to Action
4. Click **"Save Changes"**
5. ✅ Content saved to database!

## 🎯 What You Can Edit Right Now

### Hero Section

- Main title
- Subtitle with typing animation
- Button text
- Background image

### Main Content Section

- Main title
- Rotating text messages (add/remove)
- Philippines section title & description
- Bible verse quote

### Mission & Values (Carousel)

- Add/remove/edit value cards
- Customize titles, descriptions, icons, colors

### Ministries

- Add/remove ministries
- Edit titles, descriptions, icons

### Call to Action

- CTA headline
- Description
- Button text

## 📊 Admin Features

### Dashboard Navigation

- **Sidebar**: Switch between different content sections
- **Header**: View profile, access settings, logout
- **Mobile Responsive**: Works on all devices

### Content Editor Features

- ✏️ **Inline Editing**: Edit text directly in forms
- ➕ **Add Items**: Add new carousel cards, rotating texts, ministries
- 🗑️ **Delete Items**: Remove unwanted content
- 💾 **Auto-Save Ready**: Click "Save Changes" to update database
- 🔄 **Real-time Preview**: See your changes immediately

### Authentication Features

- 🔐 **Secure Login**: JWT-based authentication
- 🔒 **Protected Routes**: Only admins can access dashboard
- 👤 **User Profile**: View logged-in admin info
- 🚪 **Easy Logout**: Logout from profile menu

## 🔍 Testing the Setup

### Test 1: Authentication Flow

1. Click "Login" in navbar ✓
2. Login page appears ✓
3. Enter credentials ✓
4. Redirected to admin dashboard ✓

### Test 2: Content Editing

1. Open "Home Content" editor ✓
2. Change hero title ✓
3. Click "Save Changes" ✓
4. See success notification ✓

### Test 3: Protected Routes

1. Logout from admin dashboard ✓
2. Try to visit `/admin` directly ✓
3. Should redirect to `/login` ✓

### Test 4: Data Persistence

1. Edit content and save ✓
2. Logout ✓
3. Login again ✓
4. Content should still show your edits ✓

## 📱 Admin Interface Overview

```
┌─────────────────────────────────────────────────────┐
│ 🏠 LJIM Admin          [Profile ▼] [Settings] [🚪] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ 📄 Home  │  Homepage Content Editor                 │
│ ℹ️ About │  ┌────────────────────────────────────┐ │
│ 📅 Events│  │ Hero Section                  [▼]  │ │
│ ✉️ Contact│  ├────────────────────────────────────┤ │
│          │  │ Hero Title: [________________]      │ │
│ ⚙️ Settings│  │ Hero Subtitle: [_____________]     │ │
│          │  │ ...                                 │ │
│          │  └────────────────────────────────────┘ │
│          │                                          │
│          │  ┌────────────────────────────────────┐ │
│          │  │ Main Content Section          [▼]  │ │
│          │  └────────────────────────────────────┘ │
│          │                                          │
│          │  [💾 Save All Changes]                  │
└──────────┴──────────────────────────────────────────┘
```

## 🎨 Connecting Database to Frontend

Currently, your homepage uses **hardcoded values**. To use the admin-edited content:

### Quick Integration Example

**Before (Hardcoded):**

```javascript
<Heading>Lift Jesus International Ministries</Heading>
```

**After (Database-driven):**

```javascript
const [content, setContent] = useState(null);

useEffect(() => {
  fetch("/api/admin/homepage")
    .then((res) => res.json())
    .then((data) => setContent(data));
}, []);

<Heading>{content?.heroTitle}</Heading>;
```

### Files to Update

- `src/components/Homepage-sections/HeroImageSection.js`
- `src/components/Homepage-sections/MainContentSection.js`
- `src/components/Homepage-sections/MissionValuesSection.js`
- `src/components/Homepage-sections/MinistriesSection.js`
- `src/components/Homepage-sections/CallToActionSection.js`

## 🛠️ Troubleshooting

### Issue: "Cannot connect to database"

**Solution**: Check your `MONGODB_URI` in `.env.local`

### Issue: "Login button not showing"

**Solution**:

- Clear browser localStorage: `localStorage.clear()`
- Refresh page
- Login button should appear

### Issue: "Changes not saving"

**Solution**:

- Check browser console for errors
- Ensure you're logged in (check token in localStorage)
- Verify MongoDB connection

### Issue: "Page shows 'Loading...' forever"

**Solution**:

- Check MongoDB is running
- Check API route `/api/admin/homepage` is working
- Check browser network tab for failed requests

## 🔐 Security Notes

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 7 days
- ✅ Admin routes are protected
- ✅ API endpoints verify authentication
- ⚠️ Consider disabling `/register` endpoint in production
- ⚠️ Use HTTPS in production
- ⚠️ Keep JWT_SECRET secure and random

## 📞 Next Steps

1. ✅ Set up environment variables
2. ✅ Create admin account
3. ✅ Test content editing
4. 🔄 Update frontend components to use database content
5. 🚀 Deploy to production
6. 🔒 Secure registration endpoint

## 💡 Pro Tips

- Use the **accordion interface** to organize different sections
- **Save frequently** to avoid losing changes
- Test changes on the **live homepage** after saving
- Keep your **JWT_SECRET** secure
- **Back up your database** regularly

---

**Ready to start? Run `npm run dev` and visit `http://localhost:3000`! 🎉**
