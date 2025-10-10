/**
 * Church-themed Loading Component
 * Beautiful animated loader with cross and spiritual elements
 */

import React from "react";
import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Pulse animation for the cross
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

// Glow animation
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(160, 160, 160, 0.3); }
  50% { box-shadow: 0 0 40px rgba(160, 160, 160, 0.8); }
`;

// Rotate animation for outer circle
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Shimmer animation for text
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export default function ChurchLoader({ message = "Loading..." }) {
  const textColor = useColorModeValue("gray.700", "gray.300");
  const crossColor = useColorModeValue("gray.600", "gray.400");
  const circleColor = useColorModeValue("gray.300", "gray.600");

  return (
    <VStack spacing={6} py={20}>
      {/* Animated Cross Loader */}
      <Box position="relative" w="80px" h="80px">
        {/* Rotating outer circle */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="80px"
          h="80px"
          borderRadius="full"
          border="3px solid"
          borderColor={circleColor}
          borderTopColor="transparent"
          borderRightColor="transparent"
          animation={`${rotate} 1.5s linear infinite`}
        />

        {/* Inner pulsing circle */}
        <Box
          position="absolute"
          top="10px"
          left="10px"
          w="60px"
          h="60px"
          borderRadius="full"
          border="2px dashed"
          borderColor={circleColor}
          opacity={0.5}
          animation={`${rotate} 2s linear infinite reverse`}
        />

        {/* Cross in the center */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          animation={`${pulse} 2s ease-in-out infinite`}
        >
          {/* Vertical bar */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="4px"
            h="30px"
            bg={crossColor}
            borderRadius="2px"
            animation={`${glow} 2s ease-in-out infinite`}
          />
          {/* Horizontal bar */}
          <Box
            position="absolute"
            top="calc(50% - 6px)"
            left="50%"
            transform="translate(-50%, -50%)"
            w="20px"
            h="4px"
            bg={crossColor}
            borderRadius="2px"
            animation={`${glow} 2s ease-in-out infinite`}
          />
        </Box>

        {/* Light rays effect */}
        {[0, 45, 90, 135].map((angle) => (
          <Box
            key={angle}
            position="absolute"
            top="50%"
            left="50%"
            w="2px"
            h="40px"
            bg="linear-gradient(to bottom, transparent, rgba(160, 160, 160, 0.3), transparent)"
            transform={`translate(-50%, -50%) rotate(${angle}deg)`}
            opacity={0.4}
            animation={`${pulse} 3s ease-in-out infinite`}
            style={{ animationDelay: `${angle * 0.01}s` }}
          />
        ))}
      </Box>

      {/* Loading text with shimmer effect */}
      <Text
        fontSize="lg"
        fontWeight="medium"
        color={textColor}
        fontFamily="monospace"
        bgGradient="linear(to-r, gray.400, gray.600, gray.400)"
        bgClip="text"
        backgroundSize="200% auto"
        animation={`${shimmer} 3s linear infinite`}
      >
        {message}
      </Text>

      {/* Subtitle */}
      <Text
        fontSize="xs"
        color={textColor}
        opacity={0.6}
        fontStyle="italic"
        maxW="200px"
        textAlign="center"
      >
        &ldquo;Wait for the Lord; be strong and take heart&rdquo; - Psalm 27:14
      </Text>
    </VStack>
  );
}

/**
 * Full-page loader variant
 */
export function FullPageChurchLoader({ message = "Loading..." }) {
  const bgColor = useColorModeValue("white", "gray.900");

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <ChurchLoader message={message} />
    </Box>
  );
}

/**
 * Section loader variant (for homepage sections)
 */
export function SectionChurchLoader({
  message = "Loading...",
  minHeight = "400px",
}) {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box
      w="100%"
      minH={minHeight}
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ChurchLoader message={message} />
    </Box>
  );
}
