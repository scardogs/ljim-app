import mongoose from "mongoose";

const AboutContentSchema = new mongoose.Schema(
  {
    // Founder Section
    founderName: {
      type: String,
      default: "Bishop Ed Dalisay Fernandez",
    },
    founderTitle: {
      type: String,
      default: "Founder & Spiritual Leader",
    },
    founderBio: {
      type: String,
      default:
        "Bishop Ed Dalisay Fernandez is the founder and spiritual leader of Lift Jesus International Ministries. His ministry journey is marked by faith, humility, and a passion for evangelism. Through his leadership, LJIM has reached countless lives worldwide with the message of Jesus Christ. His vision continues to inspire believers to lift up the name of Jesus above all.",
    },
    founderImage: {
      type: String,
      default: "/images/ed-fernandez.jpg",
    },

    // Main About Section
    aboutTitle: {
      type: String,
      default: "About LJIM",
    },
    aboutDescription: {
      type: String,
      default:
        "Lift Jesus International Ministries (LJIM) is a Christ-centered global fellowship committed to spreading the message of salvation through faith in Jesus Christ.",
    },

    // Four Cards
    storyTitle: {
      type: String,
      default: "Our Story",
    },
    storyContent: {
      type: String,
      default:
        "Founded to uplift communities through faith, LJIM strives to transform lives with love, compassion, and biblical teachings.",
    },

    missionTitle: {
      type: String,
      default: "Our Mission",
    },
    missionContent: {
      type: String,
      default:
        "To bring spiritual transformation worldwide, empower believers, and serve communities through meaningful outreach programs and initiatives.",
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
    },
    visionContent: {
      type: String,
      default:
        "A world transformed by the Gospel, reflecting God's love, peace, and justice. Equipping believers to shine as lights in every community.",
    },

    valuesTitle: {
      type: String,
      default: "Core Values",
    },
    valuesContent: {
      type: String,
      default:
        "Faith, community, service, and evangelism. These values guide our ministry as we spread the message of salvation and serve the world.",
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent ||
  mongoose.model("AboutContent", AboutContentSchema);
