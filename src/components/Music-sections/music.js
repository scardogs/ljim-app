import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Music() {
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
          <Heading color={textColor}>Music</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Explore our music collection and enjoy inspiring songs and
            performances.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Our Worship Music
          </Heading>
          <Text color={subTextColor}>
            A collection of songs for worship, praise, and reflection.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
