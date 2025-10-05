import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function About() {
  // Color palette
  const bg = useColorModeValue(
    "linear(to-b, white, gray.100)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      textAlign="center"
      py={{ base: 16, md: 24 }}
    >
      <VStack spacing={8} maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* About Heading */}
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>About Us</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Welcome to the About page. Here you can learn more about our mission
            and values.
          </Text>
        </Box>

        {/* Additional Content Section */}
        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Our Story
          </Heading>
          <Text color={subTextColor}>
            We are dedicated to fostering a community of faith, love, and
            compassion.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Our Mission
          </Heading>
          <Text color={subTextColor}>
            To uplift, educate, and serve our community through meaningful
            programs and initiatives.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
