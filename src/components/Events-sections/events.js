import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Events() {
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
          <Heading color={textColor}>Events</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Stay up-to-date with upcoming events and programs.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Upcoming Events
          </Heading>
          <Text color={subTextColor}>
            Join us for worship services, community outreach, and special
            gatherings.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
