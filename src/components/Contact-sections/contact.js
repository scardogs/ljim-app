import React from "react";

import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Contact() {
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
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>Contact Us</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Reach out to us with questions, prayer requests, or feedback.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Get in Touch
          </Heading>
          <Text color={subTextColor}>
            Email: info@example.com <br />
            Phone: +123 456 7890
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
