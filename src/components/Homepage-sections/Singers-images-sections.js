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
      <Box w="100vw" py={24} textAlign="center">
        <Text>Loading...</Text>
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
    >
      {/* Section Header */}
      <VStack spacing={3} textAlign="center" mb={12}>
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

      {/* Singers Grid */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={10}
        w="full"
        maxW="6xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
      >
        {singers.map((s, index) => (
          <MotionBox
            key={s.name}
            order={s.name === "Azaleah" ? 2 : undefined} // optional: you can tweak order if needed
            bg={cardBg}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="xl"
            position="relative"
            cursor="pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 35px rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Image Cover */}
            <Box w="100%" h="320px" overflow="hidden">
              <OptimizedImage
                src={s.image}
                alt={s.name}
                width={400}
                height={320}
                crop="fill"
                gravity="faces"
                quality="auto"
                format="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
              />
            </Box>

            {/* Text Overlay */}
            <Box
              position="absolute"
              bottom="0"
              w="100%"
              bgGradient="linear(to-t, rgba(0,0,0,0.7), transparent)"
              p={5}
              textAlign="left"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"
                textShadow="0 0 10px rgba(255,255,255,0.5)"
              >
                {s.name}
              </Text>
              <Text
                fontSize="sm"
                color="gray.300"
                fontFamily="monospace"
                mt={1}
              >
                {s.tagline}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Verse Section */}
      <VStack spacing={4} mt={20} textAlign="center">
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
    </Box>
  );
}
