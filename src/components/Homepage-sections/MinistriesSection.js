import React from "react";
import { Box, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";

const ministries = [
  { name: "Worship", tagline: "Lift God in Spirit and Truth" },
  { name: "Word", tagline: "Teaching the Living Word" },
  { name: "Outreach", tagline: "Serving with Love and Compassion" },
  { name: "Discipleship", tagline: "Growing Strong in Faith" },
];

export default function MinistriesSection() {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      px={{ base: 4, md: 8 }}
    >
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={8}
        w="full"
        maxW="6xl"
        textAlign="center"
      >
        {ministries.map((m) => (
          <Box
            key={m.name}
            bg={glassBg}
            borderWidth="1px"
            borderColor={borderColor}
            backdropFilter="blur(10px)"
            borderRadius="xl"
            p={8}
            transition="all 0.3s ease"
            boxShadow="lg"
            _hover={{
              transform: "translateY(-8px) scale(1.05)",
              boxShadow: "2xl",
            }}
          >
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={3}>
              {m.name}
            </Text>
            <Text fontSize="md" color={subText}>
              {m.tagline}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
