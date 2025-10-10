import mongoose from "mongoose";

const HomepageContentSchema = new mongoose.Schema(
  {
    // Hero Section
    heroTitle: {
      type: String,
      default: "Lift Jesus International Ministries",
    },
    heroSubtitle: {
      type: String,
      default:
        "Exalting the name of Jesus, preaching the Word, and transforming lives through worship, discipleship, and outreach.",
    },
    heroButtonText: {
      type: String,
      default: "Learn More",
    },
    heroImage: {
      type: String,
      default: "/images/Untitled design.png",
    },
    heroMediaType: {
      type: String,
      enum: ["image", "video", "gif"],
      default: "image",
    },
    heroVideoUrl: {
      type: String,
      default: "",
    },

    // Main Content Section
    mainTitle: {
      type: String,
      default: "Lift Jesus International Ministries",
    },
    mainRotatingTexts: {
      type: [String],
      default: [
        "A fellowship of believers devoted to exalting Jesus Christ, preaching His Word, and transforming lives through worship, discipleship, and service.",
        "Together, we lift His name higher in every nation and glorify Him through unity and love.",
        "Empowered by the Spirit, we reach out to the world with faith, hope, and compassion.",
        "Our mission: to shine the light of Christ and make His presence known in every generation.",
      ],
    },
    philippinesTitle: {
      type: String,
      default: "LJIM – Philippines",
    },
    philippinesDescription: {
      type: String,
      default:
        "In the heart of the Philippines, Lift Jesus International Ministries stands as a beacon of hope — spreading the Gospel, building communities of faith, and raising generations of believers devoted to Christ. From city streets to remote villages, the message of His love continues to transform lives.",
    },
    philippinesBibleVerse: {
      type: String,
      default:
        '"From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work." — Ephesians 4:16, NIV',
    },
    philippinesMapImageLight: {
      type: String,
      default: "/images/map-ph.png",
    },
    philippinesMapImageDark: {
      type: String,
      default: "/images/white-map-ph.png",
    },

    // Regional Churches (Luzon, Visayas, Mindanao)
    regionalChurches: {
      type: [
        {
          region: String, // "Luzon", "Visayas", or "Mindanao"
          churchName: String,
          address: String,
          description: String,
          contactInfo: String,
        },
      ],
      default: [],
    },

    // Mission & Values Section (Carousel)
    missionValues: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
          color: String,
        },
      ],
      default: [
        {
          title: "Excellence in Faith",
          description:
            "We strive for spiritual excellence, encouraging every member to grow deeper in their relationship with God through prayer, study, and authentic worship.",
          icon: "StarIcon",
          color: "gray.600",
        },
        {
          title: "Light in Darkness",
          description:
            "We are called to be the light of the world, bringing hope, healing, and transformation to those who are lost, broken, and searching for truth.",
          icon: "SunIcon",
          color: "gray.700",
        },
        {
          title: "Community & Fellowship",
          description:
            "We believe in the power of genuine Christian community where believers support, encourage, and challenge one another to live out their faith daily.",
          icon: "ChatIcon",
          color: "gray.600",
        },
        {
          title: "Faithful Stewardship",
          description:
            "We are committed to using our time, talents, and resources wisely to advance God's kingdom and serve those in need with integrity and love.",
          icon: "CheckCircleIcon",
          color: "gray.700",
        },
      ],
    },

    // Mission & Values Background Media
    missionValuesMediaType: {
      type: String,
      enum: ["pattern", "image", "video", "gif"],
      default: "pattern",
    },
    missionValuesMediaUrl: {
      type: String,
      default: "",
    },
    missionValuesBackgroundImage: {
      type: String,
      default: "",
    },

    // Ministries Section
    ministries: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      default: [
        {
          title: "Worship Ministry",
          description:
            "Leading believers into the presence of God through heartfelt worship and praise.",
          icon: "MusicNote",
        },
        {
          title: "Discipleship",
          description:
            "Equipping believers to grow in faith, knowledge, and spiritual maturity.",
          icon: "Book",
        },
        {
          title: "Outreach",
          description:
            "Bringing the Gospel to communities and nations through evangelism and service.",
          icon: "People",
        },
      ],
    },

    // Call to Action
    ctaTitle: {
      type: String,
      default: "Join Us in Lifting Jesus Higher",
    },
    ctaDescription: {
      type: String,
      default:
        "Be part of a community that worships, grows, and serves together.",
    },
    ctaButtonText: {
      type: String,
      default: "Get Connected",
    },

    // Singers Section
    singersTitle: {
      type: String,
      default: "Worship Leaders",
    },
    singersDescription: {
      type: String,
      default:
        "Voices united in harmony — sharing their passion and faith through music that touches the heart.",
    },
    singers: {
      type: [
        {
          name: String,
          tagline: String,
          image: String,
        },
      ],
      default: [
        {
          name: "Joshua",
          tagline: "Leading hearts into worship through powerful praise.",
          image: "/images/joshua.jpg",
        },
        {
          name: "Bea",
          tagline: "Singing with grace and joy to glorify the King.",
          image: "/images/bea.jpg",
        },
        {
          name: "Hannah",
          tagline: "Lifting her voice to inspire faith and devotion.",
          image: "/images/hannah.jpg",
        },
        {
          name: "Azaleah",
          tagline: "Bringing melodies that touch the soul and uplift spirits.",
          image: "/images/azaleah.jpg",
        },
      ],
    },
    singersBibleVerse: {
      type: String,
      default:
        '"Sing to Him, sing praise to Him; tell of all His wonderful acts." — 1 Chronicles 16:9 (NIV)',
    },

    // Congregation Gallery Section
    congregationTitle: {
      type: String,
      default: "Our Congregation",
    },
    congregationDescription: {
      type: String,
      default:
        "A beautiful community of believers united in faith, worship, and service.",
    },
    congregationPhotos: {
      type: [
        {
          image: String,
          caption: String,
        },
      ],
      default: [],
    },
    congregationBibleVerse: {
      type: String,
      default:
        '"For where two or three gather in my name, there am I with them." — Matthew 18:20 (NIV)',
    },

    // Showcase Section (Flexible)
    showcaseTitle: {
      type: String,
      default: "Highlights",
    },
    showcaseDescription: {
      type: String,
      default: "Celebrating moments that matter in our ministry.",
    },
    showcaseItems: {
      type: [
        {
          title: String,
          description: String,
          image: String,
          link: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomepageContent ||
  mongoose.model("HomepageContent", HomepageContentSchema);
