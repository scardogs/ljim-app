import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import HeroImageSection from "./HeroImageSection";
import MissionVluesSection from "./MissionValuesSection";
import MinistriesSection from "./MinistriesSection";
import FooterSection from "./FooterSection";
import MainContentSection, {
  RegionalChurchesSection,
} from "../components/../Homepage-sections/MainContentSection";
import SingersImagesSection from "../components/../Homepage-sections/Singers-images-sections";
import GlowingCrossSection from "./GlowingCrossSection";
import CongregationGallery from "./CongregationGallery";
import ShowcaseSection from "./ShowcaseSection";
import FloatingVerseWidget from "../../shared/FloatingVerseWidget";
import { HomepageProvider } from "../../contexts/HomepageContext";

function HomePageContent() {
  return (
    <Box
      minH="100vh"
      bgGradient={useColorModeValue(
        "linear(to-b, white, gray.400)",
        "linear(to-b, gray.900, black)"
      )}
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      {/* Floating Verse of the Day Widget */}
      <FloatingVerseWidget />

      {/* ✅ Hero Section */}
      <Box position="relative" w="100%">
        <HeroImageSection />
      </Box>

      {/* ✅ Main Content Section */}
      <MainContentSection />

      {/* Regional Churches Accordion */}
      <RegionalChurchesSection />

      {/* Singer Images Grid */}
      <SingersImagesSection />

      {/* Glowing Cross Section */}
      <GlowingCrossSection />

      {/* Congregation Gallery */}
      <CongregationGallery />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Mission & Values */}
      <MissionVluesSection />

      {/* Ministries Grid */}
      <MinistriesSection />

      {/* Footer with Call to Action */}
      <FooterSection />
    </Box>
  );
}

export default function HomePageTab() {
  return (
    <HomepageProvider>
      <HomePageContent />
    </HomepageProvider>
  );
}
