# Regional Churches - Collapsible Locations FAQ 🗺️

## 🎉 What Was Added

A beautiful collapsible FAQ section showcasing your church locations across the Philippines organized by region (Luzon, Visayas, Mindanao)!

---

## ✅ What Was Updated

### 1. **Database Model** ✅

**File:** `models/HomepageContent.js`

Added `regionalChurches` array with:

- Region (Luzon, Visayas, or Mindanao)
- Church Name
- Address
- Description
- Contact Info

### 2. **Frontend Component** ✅

**File:** `src/components/Homepage-sections/MainContentSection.js`

Added `RegionalChurchesSection` component with:

- Collapsible accordion by region
- Color-coded badges (Luzon=Blue, Visayas=Green, Mindanao=Purple)
- Church icons and map markers
- Contact information display
- Auto-hide when empty

### 3. **Admin Panel** ✅

**File:** `src/components/admin/HomepageContentEditor.js`

Added new **"Locations"** tab with:

- Region selector dropdown
- Church name input
- Address textarea
- Description textarea
- Contact info input
- Color-coded badges by region

### 4. **Homepage Integration** ✅

The collapsible section appears right after the main Philippines content!

---

## 🎯 What It Looks Like

```
    Our Churches in the Philippines
      Find a church near you

┌──────────────────────────────────┐
│ 📍 Luzon              [3 Churches] ▼ │ ← Click to expand
├──────────────────────────────────┤
│  ⛪ LJIM Manila                    │
│  📍 123 Main St, Manila           │
│  📞 +63 123 456 7890              │
│                                   │
│  ⛪ LJIM Quezon City               │
│  📍 456 QC Avenue, Quezon City    │
│  ...                              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 📍 Visayas           [2 Churches] ▼ │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 📍 Mindanao          [1 Church]  ▼ │
└──────────────────────────────────┘
```

---

## 🎨 Features

### Collapsible Accordion

- ✅ **Click to expand/collapse** each region
- ✅ **Multiple regions** can be open at once
- ✅ **First region (Luzon)** opens by default
- ✅ **Smooth animations** on expand/collapse

### Color-Coded Regions

- 🔵 **Luzon** - Blue badges
- 🟢 **Visayas** - Green badges
- 🟣 **Mindanao** - Purple badges

### Rich Information Display

- ⛪ Church name with icon
- 📍 Full address
- 📝 Description
- 📞 Contact info (phone/email)
- 🎨 Hover effects

### Smart Features

- ✅ **Auto-hide** - Doesn't show if no churches added
- ✅ **Auto-count** - Shows number of churches per region
- ✅ **Responsive** - Perfect on all devices
- ✅ **Loading state** - Church loader while fetching

---

## 📝 How to Add Church Locations

### Step 1: Go to Admin Panel

1. Login to admin panel
2. Click **"Homepage Content"**
3. Click the **"Locations"** tab (📍 map pin icon)

### Step 2: Add a Church

1. Click **"Add New Church Location"**
2. Fill in the fields:

   **Region** (dropdown):

   - Select: Luzon, Visayas, or Mindanao

   **Church Name**:

   - Example: "LJIM Manila"

   **Address**:

   - Example: "123 Main Street, Barangay 456, Manila, Metro Manila, Philippines"

   **Description**:

   - Example: "Our main church in Manila, serving the community since 2010."

   **Contact Info**:

   - Example: "+63 912 345 6789" or "manila@ljim.com"

3. Click **"Save Changes"**

### Step 3: View on Homepage

- Scroll to the Philippines section
- See the collapsible accordion appear!

---

## 💡 Example Data

### Luzon Churches:

```
Church: LJIM Manila
Region: Luzon
Address: 123 Main Street, Manila, Metro Manila
Description: Our main church in Manila, welcoming all.
Contact: +63 912 345 6789

Church: LJIM Quezon City
Region: Luzon
Address: 456 QC Avenue, Quezon City
Description: Serving the QC community with love.
Contact: qc@ljim.com
```

### Visayas Churches:

```
Church: LJIM Cebu
Region: Visayas
Address: 789 Cebu Street, Cebu City
Description: Bringing faith to the heart of Visayas.
Contact: +63 923 456 7890
```

### Mindanao Churches:

```
Church: LJIM Davao
Region: Mindanao
Address: 321 Davao Road, Davao City
Description: Serving Mindanao with the Gospel.
Contact: davao@ljim.com
```

---

## 🎯 Use Cases

### Perfect For:

- 📍 **Church Branches** - All your locations
- 🏢 **Office Addresses** - Administrative offices
- 🎪 **Meeting Places** - Temporary locations
- 🌏 **Mission Fields** - Outreach locations
- 🏛️ **Partner Churches** - Affiliated ministries

### Information You Can Show:

- Church names and addresses
- Service times and schedules
- Contact numbers and emails
- Brief descriptions
- Special notes

---

## 🎨 Visual Design

### Region Colors:

- **Luzon** - Blue theme
- **Visayas** - Green theme
- **Mindanao** - Purple theme

### Icons Used:

- 📍 Map marker for regions
- ⛪ Church icon for church names
- 📞 Phone icon for contact info

### Interactions:

- Click region → Expand/collapse
- Hover over church card → Shadow effect
- Multiple regions can be open simultaneously

---

## 📱 Responsive Behavior

| Screen Size | Accordion Width | Layout        |
| ----------- | --------------- | ------------- |
| Mobile      | Full width      | Single column |
| Tablet      | Max 7xl         | Single column |
| Desktop     | Max 7xl         | Single column |

Each church card is full-width within the accordion for easy reading!

---

## 🔧 Technical Details

### Component Structure:

```
MainContentSection (main content)
    ↓
RegionalChurchesSection (accordion)
    ↓
    ├── Luzon Accordion (blue)
    │   └── Church cards
    ├── Visayas Accordion (green)
    │   └── Church cards
    └── Mindanao Accordion (purple)
        └── Church cards
```

### Smart Grouping:

Churches are automatically grouped by region from the database!

### Auto-Hide Logic:

- If region has 0 churches → Region doesn't show
- If all regions have 0 churches → Entire section doesn't show

---

## 🎯 Quick Start

1. **Admin Panel** → Homepage Content → **"Locations"** tab
2. **Click** "Add New Church Location"
3. **Fill in:**
   - Region: Luzon
   - Church: LJIM Manila
   - Address: Your address
   - Description: Your description
   - Contact: Your phone/email
4. **Save Changes**
5. **View Homepage** → See the collapsible section! 🎉

---

## 💡 Pro Tips

### Organization:

- Add churches in order of importance
- Group by region for easy navigation
- Include complete addresses for Google Maps

### Content:

- Keep descriptions brief (1-2 sentences)
- Include both phone and email if possible
- Mention service times in description

### Presentation:

- Update regularly as churches open/close
- Add new locations as ministry expands
- Keep contact info current

---

## 🎉 Summary

**You now have a beautiful, collapsible church locations section!**

Features:

- ✅ **3 Regions** - Luzon, Visayas, Mindanao
- ✅ **Collapsible** - Click to expand/collapse
- ✅ **Color-coded** - Blue, Green, Purple
- ✅ **Full details** - Name, address, description, contact
- ✅ **Auto-count** - Shows number of churches per region
- ✅ **Auto-hide** - Hides when empty
- ✅ **Responsive** - Perfect on all devices
- ✅ **Fully editable** - Manage from admin panel

**Perfect for multi-location ministries!** 🙏✨

---

## 📚 Related Files

### Components:

- `src/components/Homepage-sections/MainContentSection.js`
- `src/components/admin/HomepageContentEditor.js`

### Database:

- `models/HomepageContent.js`

### Homepage:

- `src/components/Homepage-sections/home-page-tab.js`

---

**Now your visitors can easily find churches in their region!** 🗺️🎉
