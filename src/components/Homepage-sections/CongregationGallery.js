import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import OptimizedImage from "../OptimizedImage";
import ChurchLoader from "../ChurchLoader";
import { useHomepageContent } from "../../contexts/HomepageContext";

const MotionBox = motion(Box);

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Background gradient shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

export default function CongregationGallery() {
  const { content, loading, error } = useHomepageContent();

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.900, black)"
  );
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.7)",
    "rgba(0, 0, 0, 0.45)"
  );
  const verseColor = useColorModeValue("gray.700", "gray.300");

  // Show loading state
  if (loading) {
    return (
      <Flex w="100vw" minH="600px" justify="center" align="center">
        <ChurchLoader message="Loading congregation gallery..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box w="100vw" py={20} textAlign="center">
        <Text color="red.500">Error loading content: {error}</Text>
      </Box>
    );
  }

  // Don't render if no content
  if (!content) {
    return null;
  }

  // Don't render if no photos - completely hide the section
  if (!content.congregationPhotos || content.congregationPhotos.length === 0) {
    return null;
  }

  return (
    <Box
      w="100vw"
      py={{ base: 16, md: 24 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
      // Performance optimization
      transform="translateZ(0)"
      willChange="auto"
    >
      <VStack spacing={8} maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <VStack spacing={3} textAlign="center">
          <Heading
            as="h2"
            size="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, gray.400, silver, black)"
            bgClip="text"
            animation={`${shimmer} 6s ease-in-out infinite`}
          >
            {content.congregationTitle || "Our Congregation"}
          </Heading>
          <Text fontSize="lg" fontFamily="monospace" color={subText} maxW="3xl">
            {content.congregationDescription ||
              "A beautiful community of believers united in faith, worship, and service."}
          </Text>
          <Divider
            w="100px"
            borderColor="gray.400"
            borderWidth="2px"
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>

        {/* Photo Grid */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={6}
          w="full"
        >
          {content.congregationPhotos.map((photo, index) => (
            <MotionBox
              key={index}
              bg={cardBg}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
              position="relative"
              cursor="pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 25px rgba(255,255,255,0.3)",
              }}
              style={{ willChange: "transform" }}
            >
              {/* Image */}
              <Box h="250px" overflow="hidden">
                <OptimizedImage
                  src={photo.image}
                  alt={photo.caption || "Congregation photo"}
                  width={400}
                  height={250}
                  crop="fill"
                  gravity="auto"
                  quality="auto"
                  format="auto"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(100%) brightness(0.85)",
                  }}
                />
              </Box>

              {/* Caption */}
              {photo.caption && (
                <Box
                  position="absolute"
                  bottom="0"
                  w="100%"
                  bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
                  p={4}
                >
                  <Text
                    fontSize="sm"
                    color="white"
                    fontFamily="monospace"
                    textAlign="center"
                  >
                    {photo.caption}
                  </Text>
                </Box>
              )}
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Bible Verse */}
        <VStack spacing={4} mt={12} textAlign="center">
          <Text
            fontSize="xl"
            fontStyle="italic"
            fontFamily="monospace"
            color={verseColor}
            maxW="3xl"
            px={6}
          >
            {content.congregationBibleVerse ||
              '"For where two or three gather in my name, there am I with them." — Matthew 18:20 (NIV)'}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
