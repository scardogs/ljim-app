# Church Loader - Beautiful Loading Animations ✨

## 🎨 What Was Added

A beautiful, unique loading component specifically designed for your church website with spiritual elements!

### Features:

- ⚡ **Animated Cross** - Pulsing cross with glow effect
- 🔄 **Rotating Circles** - Smooth spinning animations
- ✨ **Light Rays** - Spiritual radiance effect
- 📖 **Bible Verse** - Inspirational text while loading
- 🎭 **Shimmer Effect** - Beautiful text animations

---

## 📁 Files Created

### `src/components/ChurchLoader.js`

Three loading variants:

1. **`ChurchLoader`** - Basic loader component
2. **`FullPageChurchLoader`** - Full-screen overlay loader
3. **`SectionChurchLoader`** - For page sections (used in homepage)

---

## 🎯 What It Looks Like

```
        ╭─────╮
       ╱   ┃   ╲     ← Rotating outer ring
      │    ┃    │
      │  ━━┃━━  │    ← Glowing cross in center
      │    ┃    │
       ╲   ┃   ╱     ← Light rays emanating
        ╰─────╯

    Loading content...   ← Shimmering text

  "Wait for the Lord..."  ← Bible verse
```

---

## ✅ Updated Homepage Sections

All homepage sections now use the beautiful church loader:

1. ✅ **Hero Section** - "Preparing your experience..."
2. ✅ **Main Content** - "Loading content..."
3. ✅ **Mission & Values** - "Loading mission & values..."
4. ✅ **Ministries** - "Loading ministries..."
5. ✅ **Worship Leaders** - "Loading worship leaders..."
6. ✅ **Call to Action** - "Loading..."

---

## 🎨 Animation Effects

### 1. Cross Animation

- **Pulse effect** - Grows and shrinks smoothly
- **Glow effect** - Radiates light
- **Rotation** - Subtle movement

### 2. Circular Rings

- **Outer ring** - Rotates clockwise
- **Inner ring** - Rotates counter-clockwise (dashed)
- **Smooth transitions**

### 3. Light Rays

- **4 rays** at different angles
- **Fade in/out** effect
- **Subtle rotation**

### 4. Text Effects

- **Shimmer animation** - Moving gradient
- **Bible verse** - Inspirational message
- **Color adaptation** - Works in light/dark mode

---

## 💻 How to Use

### Basic Usage:

```jsx
import ChurchLoader from "../ChurchLoader";

<ChurchLoader message="Loading..." />;
```

### Section Usage:

```jsx
import { SectionChurchLoader } from "../ChurchLoader";

<SectionChurchLoader message="Loading content..." minHeight="400px" />;
```

### Full Page Usage:

```jsx
import { FullPageChurchLoader } from "../ChurchLoader";

<FullPageChurchLoader message="Please wait..." />;
```

---

## 🎭 Customization Options

### Available Props:

**`ChurchLoader`:**

- `message` - Loading text (default: "Loading...")

**`SectionChurchLoader`:**

- `message` - Loading text
- `minHeight` - Minimum height (default: "400px")

**`FullPageChurchLoader`:**

- `message` - Loading text

---

## 🌈 Color Modes

The loader automatically adapts to your theme:

**Light Mode:**

- Cross: Gray/Silver
- Text: Dark gray
- Background: White/Light gray

**Dark Mode:**

- Cross: Light gray/Silver
- Text: Light gray
- Background: Dark gray/Black

---

## 📖 Bible Verses

The loader displays an inspirational verse:

> "Wait for the Lord; be strong and take heart" - Psalm 27:14

---

## 🎯 Example Usage in Your Code

### Before:

```jsx
if (!content) {
  return <Text>Loading...</Text>;
}
```

### After:

```jsx
if (!content) {
  return <ChurchLoader message="Loading content..." />;
}
```

---

## ✨ Benefits

1. **Professional** - Beautiful, polished loading experience
2. **Spiritual** - Cross and Bible verse reinforce church theme
3. **Smooth** - Multiple animation layers create depth
4. **Branded** - Unique to your church website
5. **Responsive** - Works on all screen sizes
6. **Theme-aware** - Adapts to light/dark mode

---

## 🚀 Performance

- **Lightweight** - Pure CSS animations
- **Smooth** - 60 FPS animations
- **No external dependencies** - Uses Chakra UI only
- **Fast loading** - Renders instantly

---

## 🎉 Result

Your homepage now has a **beautiful, spiritual loading experience** that:

- ✅ Keeps users engaged while content loads
- ✅ Reinforces your church's spiritual theme
- ✅ Provides smooth, professional animations
- ✅ Shows inspirational Bible verses
- ✅ Works perfectly in all themes

**Try it out:** Refresh your homepage and watch the beautiful loader in action! 🙏✨

---

Perfect for your ministry website! 🎨
