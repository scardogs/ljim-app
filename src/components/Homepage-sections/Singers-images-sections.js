import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import OptimizedImage from "../OptimizedImage";
import { SectionChurchLoader } from "../ChurchLoader";

const MotionBox = motion(Box);

// Gentle shimmer for text
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating background shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

export default function SingersSection() {
  const [content, setContent] = useState(null);

  const subText = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.7)",
    "rgba(0, 0, 0, 0.45)"
  );
  const verseColor = useColorModeValue("gray.700", "gray.300");
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Get singers from content or use defaults
  const singers = content?.singers || [];

  // Show loading state
  if (!content) {
    return (
      <Box w="100vw">
        <SectionChurchLoader
          message="Loading worship leaders..."
          minHeight="600px"
        />
      </Box>
    );
  }

  return (
    <Box
      w="100vw"
      py={{ base: 20, md: 28 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="20%"
        right="-10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="gray.500"
        opacity={0.02}
        filter="blur(100px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="gray.600"
        opacity={0.02}
        filter="blur(120px)"
      />

      <VStack spacing={16} maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Section Header */}
        <VStack spacing={3} textAlign="center">
          <Heading
            as="h2"
            size="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, gray.400, silver, black)"
            bgClip="text"
            animation={`${shimmer} 6s ease-in-out infinite`}
          >
            {content.singersTitle || "Worship Leaders"}
          </Heading>
          <Text fontSize="lg" fontFamily="monospace" color={subText} maxW="3xl">
            {content.singersDescription ||
              "Voices united in harmony — sharing their passion and faith through music that touches the heart."}
          </Text>
          <Divider
            w="100px"
            borderColor="gray.400"
            borderWidth="2px"
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>

        {/* Modern Cards Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 8, md: 10 }}
          w="full"
        >
          {singers.map((s, index) => (
            <MotionBox
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <VStack
                spacing={0}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-10px)" }}
              >
                {/* Image Container - Circular/Portrait Style */}
                <Box position="relative" w="full" mb={6}>
                  {/* Decorative Circle Background */}
                  <Box
                    position="absolute"
                    top="-10px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="90%"
                    h="100%"
                    borderRadius="3xl"
                    bg="gray.400"
                    opacity={0.05}
                    zIndex={0}
                  />

                  {/* Main Image */}
                  <MotionBox
                    w="full"
                    h={{ base: "350px", md: "380px" }}
                    borderRadius="3xl"
                    overflow="hidden"
                    boxShadow="0 20px 50px rgba(0,0,0,0.15)"
                    position="relative"
                    zIndex={1}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OptimizedImage
                      src={s.image}
                      alt={s.name}
                      width={400}
                      height={380}
                      crop="fill"
                      gravity="faces"
                      quality="auto"
                      format="auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "grayscale(100%) brightness(0.85)",
                      }}
                    />
                  </MotionBox>

                  {/* Decorative Line */}
                  <Box
                    position="absolute"
                    bottom="-3"
                    left="50%"
                    transform="translateX(-50%)"
                    w="60%"
                    h="6px"
                    bg="gray.400"
                    borderRadius="full"
                    opacity={0.3}
                  />
                </Box>

                {/* Text Content Below Image */}
                <VStack spacing={2} textAlign="center" px={4}>
                  <Heading
                    size="lg"
                    color={textColor}
                    fontFamily="monospace"
                    letterSpacing="tight"
                  >
                    {s.name}
                  </Heading>

                  <Box
                    w="40px"
                    h="2px"
                    bg="gray.400"
                    borderRadius="full"
                    my={2}
                  />

                  <Text
                    fontSize="sm"
                    color={subText}
                    fontFamily="monospace"
                    lineHeight="1.6"
                    maxW="280px"
                  >
                    {s.tagline}
                  </Text>
                </VStack>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Verse Section */}
        <VStack spacing={4} textAlign="center" mt={12}>
          <Text
            fontSize="xl"
            fontStyle="italic"
            fontFamily="monospace"
            color={verseColor}
            maxW="3xl"
            px={6}
          >
            {content.singersBibleVerse ||
              '"Sing to Him, sing praise to Him; tell of all His wonderful acts." — 1 Chronicles 16:9 (NIV)'}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
