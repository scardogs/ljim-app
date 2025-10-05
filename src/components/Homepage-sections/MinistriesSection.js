import React from "react";
import { Box, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react"; // ✅ Correct import

const MotionBox = motion(Box);

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ministries = [
  { name: "Worship", tagline: "Lift God in Spirit and Truth" },
  { name: "Word", tagline: "Teaching the Living Word" },
  { name: "Outreach", tagline: "Serving with Love and Compassion" },
  { name: "Discipleship", tagline: "Growing Strong in Faith" },
];

export default function MinistriesSection() {
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w="100vw"
      h="60vh"
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
        {ministries.map((m, index) => (
          <MotionBox
            key={m.name}
            bg={glassBg}
            borderWidth="1px"
            borderColor={borderColor}
            backdropFilter="blur(10px)"
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            animate={{ scale: [1, 1.05, 1] }} // heartbeat
            transition={{
              delay: index * 1,
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              mb={3}
              bgGradient="linear(to-r, gray.400, silver, black)"
              bgClip="text"
              bgSize="200% 100%"
              fontFamily="monospace"
              animation={`${shimmer} 2s linear infinite`}
            >
              {m.name}
            </Text>
            <Text fontSize="md" color={subText}>
              {m.tagline}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}
