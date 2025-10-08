# Admin Module Setup Guide

This guide will help you set up and use the Admin Module for the LJIM Next.js application.

## 🚀 Installation & Setup

### 1. Install Dependencies

All required dependencies have been installed:

- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cookie` - Cookie handling

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace these with your actual values!

### 3. Database Setup

The application will automatically create the necessary collections in MongoDB:

- `admins` - Stores admin user accounts
- `homepagecontents` - Stores editable homepage content

## 👤 Creating Your First Admin Account

### Method 1: Using the Registration Page (Recommended for First Setup)

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`

3. Fill in the registration form:

   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password

4. Click "Register"

5. You'll be automatically logged in and redirected to the admin dashboard

### Method 2: Direct Database Creation (For Production)

You can create an admin account directly in your MongoDB database using MongoDB Compass or the MongoDB Shell.

**Note:** After creating your first admin account in production, you may want to disable the registration endpoint for security. To do this, modify `src/pages/api/auth/register.js` to add authentication checks.

## 📝 Using the Admin Module

### Logging In

1. Navigate to your website
2. Click the "Login" button in the navigation bar
3. Enter your admin credentials
4. Click "Login"
5. You'll be redirected to the Admin Dashboard

### Admin Dashboard Features

#### Sidebar Navigation

- **Home Content** - Edit all homepage sections
- **About** - Edit about page (Coming soon)
- **Events** - Manage events (Coming soon)
- **Contact** - Edit contact information (Coming soon)
- **Settings** - Admin settings (Coming soon)

#### Homepage Content Editor

The Homepage Content Editor allows you to edit all sections of the homepage:

##### 1. Hero Section

- **Hero Title** - Main heading
- **Hero Subtitle** - Tagline/description with typing animation
- **Hero Button Text** - Call-to-action button text
- **Hero Image Path** - Path to background image

##### 2. Main Content Section

- **Main Title** - Section title
- **Rotating Texts** - Array of texts that rotate with animation
- **Philippines Title** - Subtitle for Philippines section
- **Philippines Description** - Main description text
- **Philippines Bible Verse** - Featured scripture verse

##### 3. Mission & Values (Carousel)

Each card contains:

- **Title** - Card title
- **Description** - Card content
- **Icon** - Chakra UI icon name (e.g., StarIcon, SunIcon, ChatIcon)
- **Color** - Chakra UI color value (e.g., gray.600, blue.500)

You can add or remove cards using the "Add Mission/Value Card" and delete buttons.

##### 4. Ministries Section

Each ministry contains:

- **Title** - Ministry name
- **Description** - Brief description
- **Icon** - Icon identifier

Add or remove ministries as needed.

##### 5. Call to Action Section

- **CTA Title** - Main heading
- **CTA Description** - Supporting text
- **CTA Button Text** - Button label

### Saving Changes

1. Edit any field in the homepage content editor
2. Click the "Save Changes" button at the top or bottom of the page
3. A success notification will appear when saved
4. Changes are immediately reflected in the database
5. Refresh your homepage to see the updates

### Logging Out

1. Click on your profile avatar/name in the top-right corner
2. Select "Logout" from the dropdown menu
3. You'll be logged out and redirected to the homepage

## 🔒 Security Features

### Authentication

- JWT-based authentication with 7-day token expiration
- Passwords are hashed using bcryptjs with salt rounds
- Tokens stored in localStorage (consider using httpOnly cookies for production)

### Protected Routes

- Admin pages automatically redirect to login if not authenticated
- API endpoints verify JWT tokens before allowing modifications
- Public can still view homepage content (GET requests)
- Only authenticated admins can update content (PUT requests)

### Route Protection

The admin routes are protected with client-side authentication checks:

- Non-authenticated users are redirected to `/login`
- Token verification happens on page load
- Expired tokens trigger automatic logout

## 🎨 Updating Homepage Components to Use Database Content

To make your homepage sections pull data from the database instead of hardcoded values:

### Example: Update HeroImageSection.js

```javascript
import React, { useState, useEffect } from "react";
// ... other imports

export default function HeroSection() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error(err));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <Box>
      <Heading>{content.heroTitle}</Heading>
      <Text>{content.heroSubtitle}</Text>
      {/* Use content.heroButtonText, content.heroImage, etc. */}
    </Box>
  );
}
```

Apply similar patterns to:

- `MainContentSection.js` - Use mainTitle, mainRotatingTexts, etc.
- `MissionValuesSection.js` - Use missionValues array
- `MinistriesSection.js` - Use ministries array
- `CallToActionSection.js` - Use ctaTitle, ctaDescription, ctaButtonText

## 📁 Project Structure

### New Files Added

```
ljim-app/
├── models/
│   ├── Admin.js                          # Admin user model
│   └── HomepageContent.js                # Homepage content model
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── HomepageContentEditor.js  # Content editing interface
│   │   └── navbar.js                     # Updated with Login button
│   ├── pages/
│   │   ├── admin/
│   │   │   └── index.js                  # Admin dashboard
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   └── homepage.js           # Homepage content API
│   │   │   └── auth/
│   │   │       ├── login.js              # Login endpoint
│   │   │       ├── register.js           # Registration endpoint
│   │   │       └── verify.js             # Token verification endpoint
│   │   ├── login.js                      # Login page
│   │   └── register.js                   # Registration page
│   └── utils/
│       └── auth.js                       # JWT utilities and middleware
├── .env.local.example                    # Environment variables template
└── ADMIN_SETUP_GUIDE.md                 # This file
```

## 🐛 Troubleshooting

### "No token provided" error

- Make sure you're logged in
- Check if the token exists in localStorage
- Try logging out and logging back in

### "Failed to fetch homepage content"

- Ensure MongoDB connection is working
- Check your MONGODB_URI in .env.local
- Verify the database connection in the server logs

### Changes not appearing on homepage

- The homepage components still use hardcoded values
- You need to update each component to fetch from the API
- See "Updating Homepage Components" section above

### Registration not working

- Ensure all required fields are filled
- Password must be at least 6 characters
- Email must be unique (not already registered)

## 🔐 Production Security Recommendations

1. **Disable Public Registration**

   - After creating admin accounts, restrict the `/api/auth/register` endpoint
   - Add authentication middleware to prevent unauthorized registrations

2. **Use httpOnly Cookies**

   - Consider storing JWT in httpOnly cookies instead of localStorage
   - Provides better protection against XSS attacks

3. **Environment Variables**

   - Use strong, random JWT_SECRET in production
   - Never commit .env.local to version control

4. **HTTPS Only**

   - Always use HTTPS in production
   - JWT tokens should never be transmitted over HTTP

5. **Rate Limiting**

   - Implement rate limiting on authentication endpoints
   - Prevents brute force attacks

6. **Token Refresh**
   - Consider implementing refresh tokens for better security
   - Current setup uses 7-day token expiration

## 📞 Support

For issues or questions about the admin module, please contact your development team or check the project's issue tracker.

---

**Built with ❤️ for LJIM**
