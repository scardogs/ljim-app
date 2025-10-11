import React, { useState, useEffect } from "react";
import { Box, VStack, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import ChurchLoader from "../ChurchLoader";

const MotionBox = motion(Box);

// Glowing pulse animation
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(192, 192, 192, 0.4),
      0 0 40px rgba(192, 192, 192, 0.3),
      0 0 60px rgba(192, 192, 192, 0.2),
      0 0 80px rgba(192, 192, 192, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(192, 192, 192, 0.6),
      0 0 60px rgba(192, 192, 192, 0.5),
      0 0 90px rgba(192, 192, 192, 0.3),
      0 0 120px rgba(192, 192, 192, 0.2),
      inset 0 0 30px rgba(255, 255, 255, 0.3);
  }
`;

// Subtle floating animation
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Background gradient shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

// Light rays animation
const rayAnimation = keyframes`
  0% {
    opacity: 0.1;
    transform: rotate(0deg) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    opacity: 0.1;
    transform: rotate(360deg) scale(1);
  }
`;

export default function GlowingCrossSection() {
  const [content, setContent] = useState(null);

  const bgGradient = useColorModeValue(
    "linear(to-b, white, gray.50, white)",
    "linear(to-b, black, gray.900, black)"
  );
  const crossColor = useColorModeValue("gray.300", "gray.600");
  const verseColor = useColorModeValue("gray.700", "gray.300");

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Show loading state
  if (!content) {
    return (
      <Flex w="100vw" minH="600px" justify="center" align="center">
        <ChurchLoader message="Loading..." />
      </Flex>
    );
  }

  return (
    <Box
      w="100vw"
      height="50vw"
      py={{ base: 24, md: 32 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="gray.400"
        opacity={0.02}
        filter="blur(100px)"
      />

      {/* Animated Light Rays */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="800px"
        h="800px"
        bgGradient="conic(from 0deg, transparent, rgba(192, 192, 192, 0.05), transparent, rgba(192, 192, 192, 0.05), transparent)"
        animation={`${rayAnimation} 20s linear infinite`}
        pointerEvents="none"
      />

      <VStack spacing={8} maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Main Cross Container */}
        <MotionBox
          position="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Outer Glow Ring */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="400px"
            h="400px"
            borderRadius="full"
            bg="transparent"
            border="2px solid"
            borderColor="gray.400"
            opacity={0.1}
            animation={`${glowPulse} 4s ease-in-out infinite`}
          />

          {/* The Glowing Cross */}
          <Box
            position="relative"
            w={{ base: "200px", md: "280px" }}
            h={{ base: "280px", md: "380px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            animation={`${floatAnimation} 6s ease-in-out infinite`}
          >
            {/* Vertical Beam */}
            <Box
              position="absolute"
              w={{ base: "40px", md: "50px" }}
              h={{ base: "240px", md: "320px" }}
              bg={crossColor}
              bgGradient="linear(to-b, gray.400, silver, gray.500, black)"
              borderRadius="lg"
              animation={`${glowPulse} 3s ease-in-out infinite`}
              _before={{
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "lg",
                padding: "2px",
                background:
                  "linear-gradient(45deg, silver, white, silver, gray.400)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Horizontal Beam */}
            <Box
              position="absolute"
              w={{ base: "160px", md: "200px" }}
              h={{ base: "40px", md: "50px" }}
              bg={crossColor}
              bgGradient="linear(to-r, gray.400, silver, gray.500, black)"
              borderRadius="lg"
              animation={`${glowPulse} 3s ease-in-out infinite 0.5s`}
              _before={{
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "lg",
                padding: "2px",
                background:
                  "linear-gradient(45deg, silver, white, silver, gray.400)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Center Glow Point */}
            <Box
              position="absolute"
              w={{ base: "60px", md: "80px" }}
              h={{ base: "60px", md: "80px" }}
              borderRadius="full"
              bgGradient="radial(circle, white, silver, transparent)"
              opacity={0.6}
              animation={`${glowPulse} 2s ease-in-out infinite`}
              filter="blur(10px)"
            />
          </Box>
        </MotionBox>

        {/* Bible Verse */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          mt={12}
        >
          <VStack spacing={4} textAlign="center">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontStyle="italic"
              fontFamily="monospace"
              color={verseColor}
              maxW="3xl"
              px={6}
              lineHeight="tall"
              textShadow="0 0 20px rgba(192, 192, 192, 0.1)"
            >
              {content.crossSectionVerse ||
                '"For the message of the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God." — 1 Corinthians 1:18 (NIV)'}
            </Text>
          </VStack>
        </MotionBox>
      </VStack>
    </Box>
  );
}
