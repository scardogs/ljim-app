import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Flex,
  Link,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import OptimizedImage from "../OptimizedImage";
import ChurchLoader from "../ChurchLoader";

const MotionBox = motion(Box);

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Background gradient shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

export default function ShowcaseSection() {
  const [content, setContent] = useState(null);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-b, white, gray.50)",
    "linear(to-b, black, gray.900)"
  );
  const cardBg = useColorModeValue("white", "rgba(0, 0, 0, 0.6)");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
        <ChurchLoader message="Loading showcase..." />
      </Flex>
    );
  }

  // Don't render if no showcase items - completely hide the section
  if (!content.showcaseItems || content.showcaseItems.length === 0) {
    return null;
  }

  return (
    <Box
      w="100vw"
      py={{ base: 16, md: 24 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
    >
      <VStack spacing={8} maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <VStack spacing={3} textAlign="center">
          <Heading
            as="h2"
            size="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, gray.400, silver, black)"
            bgClip="text"
            animation={`${shimmer} 6s ease-in-out infinite`}
          >
            {content.showcaseTitle || "Highlights"}
          </Heading>
          <Text fontSize="lg" fontFamily="monospace" color={subText} maxW="3xl">
            {content.showcaseDescription ||
              "Celebrating moments that matter in our ministry."}
          </Text>
          <Divider
            w="100px"
            borderColor="gray.400"
            borderWidth="2px"
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>

        {/* Showcase Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
          {content.showcaseItems.map((item, index) => (
            <MotionBox
              key={index}
              bg={cardBg}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "2xl",
              }}
              cursor={item.link ? "pointer" : "default"}
            >
              {/* Image */}
              {item.image && (
                <Box h="200px" overflow="hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.title || "Showcase item"}
                    width={600}
                    height={200}
                    crop="fill"
                    gravity="auto"
                    quality="auto"
                    format="auto"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              {/* Content */}
              <VStack align="stretch" p={6} spacing={3}>
                <Heading size="md" color={textColor} fontFamily="monospace">
                  {item.title}
                </Heading>

                {item.description && (
                  <Text color={subText} fontSize="sm">
                    {item.description}
                  </Text>
                )}

                {item.link && (
                  <Link
                    href={item.link}
                    isExternal
                    color="gray.600"
                    fontSize="sm"
                    fontWeight="semibold"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    _hover={{ color: "gray.800" }}
                  >
                    Learn More <ExternalLinkIcon mx="2px" />
                  </Link>
                )}
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
