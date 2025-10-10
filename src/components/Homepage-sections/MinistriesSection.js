import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Heading,
  VStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import ChurchLoader from "../ChurchLoader";

const MotionBox = motion(Box);

// Shimmer for text
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Subtle background gradient animation
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

export default function MinistriesSection() {
  const [content, setContent] = React.useState(null);

  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.85)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const verseColor = useColorModeValue("gray.700", "gray.300");
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.100, white)",
    "linear(to-b, gray.800, black)"
  );

  // Fetch content from database
  React.useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Get ministries from content or use defaults
  const ministries = content?.ministries || [];

  // Show loading state
  if (!content) {
    return (
      <Flex w="100vw" minH="500px" justify="center" align="center">
        <ChurchLoader message="Loading ministries..." />
      </Flex>
    );
  }

  return (
    <Box
      w="100vw"
      py={{ base: 16, md: 24 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 20s ease infinite`}
      textAlign="center"
    >
      {/* Header Section */}
      <VStack spacing={4} mb={10}>
        <Heading
          as="h2"
          size="xl"
          bgGradient="linear(to-r, gray.500, black)"
          bgClip="text"
          animation={`${shimmer} 6s linear infinite`}
        >
          Our Ministries
        </Heading>
        <Text fontSize="lg" color={subText} maxW="3xl">
          Each ministry is a reflection of God&apos;s heart — reaching,
          teaching, and transforming lives through His Word and Spirit.
        </Text>
        <Divider
          w="80px"
          borderColor="gray.400"
          borderWidth="2px"
          borderRadius="full"
          opacity={0.6}
          animation={`${shimmer} 4s linear infinite`}
        />
      </VStack>

      {/* Ministries Grid */}
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={10}
        w="full"
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
      >
        {ministries.map((m, index) => (
          <MotionBox
            key={index}
            bg={glassBg}
            borderWidth="1px"
            borderColor={borderColor}
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            p={8}
            boxShadow="lg"
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(255,255,255,0.4)",
            }}
            transition={{ duration: 0.4 }}
          >
            <Text
              fontSize="2xl"
              fontWeight="extrabold"
              mb={3}
              bgGradient="linear(to-r, gray.400, silver, black)"
              bgClip="text"
              bgSize="200% 100%"
              fontFamily="monospace"
              animation={`${shimmer} 3s linear infinite`}
            >
              {m.title}
            </Text>
            <Text fontSize="md" color={subText}>
              {m.description}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Bible Verse */}
      <VStack spacing={3} mt={16}>
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontFamily={"monospace"}
          color={verseColor}
          maxW="3xl"
        >
          &ldquo;Each of you should use whatever gift you have received to serve
          others, as faithful stewards of God&apos;s grace in its various
          forms.&rdquo;
        </Text>
        <Text fontWeight="bold" color={verseColor}>
          — 1 Peter 4:10 (NIV)
        </Text>
      </VStack>
    </Box>
  );
}
