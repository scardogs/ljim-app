import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaChurch, FaPhone } from "react-icons/fa";
import ChurchLoader from "../ChurchLoader";
import OptimizedImage from "../OptimizedImage";
import { useHomepageContent } from "../../contexts/HomepageContext";

// Gentle shimmer
const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const MotionText = motion(Text);

export default function IntroSection() {
  const { content, loading, error } = useHomepageContent();
  const [index, setIndex] = useState(0);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const verseColor = useColorModeValue("gray.700", "gray.300");
  const isDarkMode = useColorModeValue(false, true);

  // Rotate through texts
  useEffect(() => {
    if (!content?.mainRotatingTexts?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % content.mainRotatingTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [content?.mainRotatingTexts?.length]);

  // Show loading state
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <ChurchLoader message="Loading content..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box py={20} textAlign="center">
        <Text color="red.500">Error loading content: {error}</Text>
      </Box>
    );
  }

  // Don't render if no content
  if (!content) {
    return null;
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      spacing={8}
      maxW="7xl"
      mx="auto"
      py={12}
      px={6}
      gap={12}
    >
      {/* Text Content */}
      <VStack spacing={8} maxW={{ base: "full", md: "50%" }} textAlign="left">
        {/* Title */}
        <Heading
          as="h2"
          size="2xl"
          fontWeight="extrabold"
          color={textColor}
          letterSpacing="tight"
          lineHeight="1.2"
        >
          Lift Jesus{" "}
          <Box
            as="span"
            bgGradient="linear(to-r, gray.300, silver, white, gray.500, black)"
            bgSize="200% auto"
            bgClip="text"
            color="transparent"
            animation={`${shimmer} 8s ease-in-out infinite`}
          >
            International Ministries
          </Box>
        </Heading>

        {/* Animated Rotating Text */}
        <Box position="relative" minH="100px" w="100%">
          <AnimatePresence mode="wait">
            <MotionText
              key={index}
              position="absolute"
              w="100%"
              fontSize={{ base: "lg", md: "xl" }}
              color={subText}
              lineHeight="1.9"
              fontFamily="monospace"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
            >
              {content.mainRotatingTexts?.[index] || ""}
            </MotionText>
          </AnimatePresence>
        </Box>

        {/* Church Description */}
        <VStack spacing={4} maxW="full">
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-r, silver, gray.400, black)"
            bgClip="text"
          >
            {content.philippinesTitle || "LJIM – Philippines"}
          </Heading>

          <Text
            color={subText}
            fontSize="md"
            lineHeight="1.8"
            fontFamily="monospace"
          >
            {content.philippinesDescription ||
              "In the heart of the Philippines, Lift Jesus International Ministries stands as a beacon of hope — spreading the Gospel, building communities of faith, and raising generations of believers devoted to Christ."}
          </Text>

          <Text
            fontStyle="italic"
            fontFamily="monospace"
            color={verseColor}
            fontSize="sm"
            mt={2}
          >
            {content.philippinesBibleVerse ||
              '"From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work." — Ephesians 4:16, NIV'}
          </Text>
        </VStack>
      </VStack>

      {/* Map Image */}
      <Box
        flexShrink={0}
        w={{ base: "90%", md: "40%" }}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 0 25px rgba(255,255,255,0.1)"
        transition="transform 1.5s ease, box-shadow 1.5s ease"
        _hover={{
          transform: "scale(1.03)",
          boxShadow: "0 0 35px rgba(255,255,255,0.2)",
        }}
      >
        <OptimizedImage
          src={
            isDarkMode
              ? content.philippinesMapImageDark || "/images/white-map-ph.png"
              : content.philippinesMapImageLight || "/images/map-ph.png"
          }
          alt="Philippines Map"
          width={600}
          height={600}
          crop="fit"
          gravity={undefined}
          quality="auto"
          format="auto"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
    </Flex>
  );
}

/**
 * Regional Churches Accordion Section
 * Collapsible FAQ for Luzon, Visayas, Mindanao
 */
export function RegionalChurchesSection() {
  const { content, loading, error } = useHomepageContent();

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "rgba(0, 0, 0, 0.6)");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const accordionBg = useColorModeValue("gray.50", "gray.800");

  // Show loading state
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <ChurchLoader message="Loading church locations..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box py={20} textAlign="center">
        <Text color="red.500">Error loading content: {error}</Text>
      </Box>
    );
  }

  // Don't render if no content
  if (!content) {
    return null;
  }

  // Group churches by region
  const luzonChurches =
    content.regionalChurches?.filter((c) => c.region === "Luzon") || [];
  const visayasChurches =
    content.regionalChurches?.filter((c) => c.region === "Visayas") || [];
  const mindanaoChurches =
    content.regionalChurches?.filter((c) => c.region === "Mindanao") || [];

  // Don't render if no churches
  if (
    luzonChurches.length === 0 &&
    visayasChurches.length === 0 &&
    mindanaoChurches.length === 0
  ) {
    return null;
  }

  const RegionSection = ({ churches, regionName }) => {
    if (churches.length === 0) return null;

    return (
      <AccordionItem
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        mb={4}
      >
        <AccordionButton
          _hover={{ bg: hoverBg }}
          py={4}
          px={6}
          _expanded={{ bg: accordionBg }}
        >
          <HStack flex="1" spacing={3}>
            <FaMapMarkerAlt />
            <Heading size="md" color={textColor} fontFamily="monospace">
              {regionName}
            </Heading>
            <Badge fontSize="sm">
              {churches.length} {churches.length === 1 ? "Church" : "Churches"}
            </Badge>
          </HStack>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={6} px={6} bg={accordionBg}>
          <VStack spacing={4} align="stretch">
            {churches.map((church, idx) => (
              <Box
                key={idx}
                p={4}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ boxShadow: "md" }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={2}>
                  <HStack>
                    <FaChurch />
                    <Heading size="sm" color={textColor}>
                      {church.churchName}
                    </Heading>
                  </HStack>

                  {church.address && (
                    <HStack align="start" spacing={2}>
                      <FaMapMarkerAlt
                        style={{ marginTop: "4px", flexShrink: 0 }}
                      />
                      <Text
                        fontSize="sm"
                        color={subText}
                        fontFamily="monospace"
                      >
                        {church.address}
                      </Text>
                    </HStack>
                  )}

                  {church.description && (
                    <Text fontSize="sm" color={subText} mt={2}>
                      {church.description}
                    </Text>
                  )}

                  {church.contactInfo && (
                    <HStack spacing={2} mt={2}>
                      <FaPhone style={{ flexShrink: 0 }} />
                      <Text
                        fontSize="sm"
                        color={subText}
                        fontFamily="monospace"
                      >
                        {church.contactInfo}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    );
  };

  return (
    <VStack spacing={6} w="full" maxW="7xl" mx="auto" py={8}>
      <Heading
        size="xl"
        color={textColor}
        fontFamily="monospace"
        textAlign="center"
      >
        Our Churches in the Philippines
      </Heading>
      <Text
        fontSize="md"
        color={subText}
        textAlign="center"
        maxW="2xl"
        fontFamily="monospace"
      >
        Find a church near you
      </Text>

      <Accordion position="relative" allowMultiple w="full">
        <RegionSection churches={luzonChurches} regionName="Luzon" />
        <RegionSection churches={visayasChurches} regionName="Visayas" />
        <RegionSection churches={mindanaoChurches} regionName="Mindanao" />
      </Accordion>
    </VStack>
  );
}
