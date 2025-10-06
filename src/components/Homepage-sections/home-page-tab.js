import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  useColorModeValue,
  IconButton,
  HStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Flex,
  Fade,
} from "@chakra-ui/react";
import {
  InfoOutlineIcon,
  StarIcon,
  AtSignIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRouter } from "next/router";
import HeroImageSection from "./HeroImageSection";
import MissionVluesSection from "./MissionValuesSection";
import MinistriesSection from "./MinistriesSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";
import MainContentSection from "../components/../Homepage-sections/MainContentSection";
import SingersImagesSection from "../components/../Homepage-sections/Singers-images-sections";
const ministries = [
  { name: "Worship", tagline: "Lift God in Spirit and Truth" },
  { name: "Word", tagline: "Teaching the Living Word" },
  { name: "Outreach", tagline: "Serving with Love and Compassion" },
  { name: "Discipleship", tagline: "Growing Strong in Faith" },
];

export default function HomePageTab() {
  const router = useRouter();

  // Palette
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      minH="100vh"
      bgGradient={useColorModeValue(
        "linear(to-b, white, gray.100)",
        "linear(to-b, gray.900, black)"
      )}
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      {/* ✅ Hero Section */}
      <Box position="relative" w="100%">
        <HeroImageSection />
      </Box>

      {/* ✅ Main Content Section */}
      <Box px={{ base: 4, md: 8 }} py={{ base: 16, md: 24 }}>
        <VStack align="center" maxW="6xl" mx="auto">
          <MainContentSection />
          {/* Singer Images Grid */}
          <SingersImagesSection />
          {/* Mission & Values */}
          <MissionVluesSection />

          {/* Ministries Grid */}
          <MinistriesSection />
          {/* Call to Action */}
          <CallToActionSection />
          {/* Footer */}
          <FooterSection />
        </VStack>
      </Box>
    </Box>
  );
}
