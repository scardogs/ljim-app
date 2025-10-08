import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";

// Gentle shimmer
const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const MotionText = motion(Text);

export default function IntroSection() {
  const [content, setContent] = useState(null);
  const [index, setIndex] = useState(0);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const mapImage = useColorModeValue(
    "/images/map-ph.png",
    "/images/white-map-ph.png"
  );
  const verseColor = useColorModeValue("gray.700", "gray.300");

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Rotate through texts
  useEffect(() => {
    if (!content?.mainRotatingTexts?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % content.mainRotatingTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [content?.mainRotatingTexts?.length]);

  // Show loading state
  if (!content) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      spacing={8}
      maxW="7xl"
      mx="auto"
      py={12}
      px={6}
      gap={12}
    >
      {/* Text Content */}
      <VStack spacing={8} maxW={{ base: "full", md: "50%" }} textAlign="left">
        {/* Title */}
        <Heading
          as="h2"
          size="2xl"
          fontWeight="extrabold"
          color={textColor}
          letterSpacing="tight"
          lineHeight="1.2"
        >
          Lift Jesus{" "}
          <Box
            as="span"
            bgGradient="linear(to-r, gray.300, silver, white, gray.500, black)"
            bgSize="200% auto"
            bgClip="text"
            color="transparent"
            animation={`${shimmer} 8s ease-in-out infinite`}
          >
            International Ministries
          </Box>
        </Heading>

        {/* Animated Rotating Text */}
        <Box position="relative" minH="100px" w="100%">
          <AnimatePresence mode="wait">
            <MotionText
              key={index}
              position="absolute"
              w="100%"
              fontSize={{ base: "lg", md: "xl" }}
              color={subText}
              lineHeight="1.9"
              fontFamily="monospace"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
            >
              {content.mainRotatingTexts?.[index] || ""}
            </MotionText>
          </AnimatePresence>
        </Box>

        {/* Church Description */}
        <VStack spacing={4} maxW="full">
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-r, silver, gray.400, black)"
            bgClip="text"
          >
            {content.philippinesTitle || "LJIM – Philippines"}
          </Heading>

          <Text
            color={subText}
            fontSize="md"
            lineHeight="1.8"
            fontFamily="monospace"
          >
            {content.philippinesDescription ||
              "In the heart of the Philippines, Lift Jesus International Ministries stands as a beacon of hope — spreading the Gospel, building communities of faith, and raising generations of believers devoted to Christ."}
          </Text>

          <Text
            fontStyle="italic"
            fontFamily="monospace"
            color={verseColor}
            fontSize="sm"
            mt={2}
          >
            {content.philippinesBibleVerse ||
              '"From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work." — Ephesians 4:16, NIV'}
          </Text>
        </VStack>
      </VStack>

      {/* Map Image */}
      <Box flexShrink={0} w={{ base: "90%", md: "40%" }}>
        <Image
          src={mapImage}
          alt="Philippines Map"
          borderRadius="2xl"
          boxShadow="0 0 25px rgba(255,255,255,0.1)"
          transition="transform 1.5s ease, box-shadow 1.5s ease"
          _hover={{
            transform: "scale(1.03)",
            boxShadow: "0 0 35px rgba(255,255,255,0.2)",
          }}
        />
      </Box>
    </Flex>
  );
}
