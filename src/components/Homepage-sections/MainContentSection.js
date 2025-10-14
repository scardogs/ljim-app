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

// Floating animation for church icons
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

// Pulse animation for interactive elements
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
`;

// Wave animation for background elements
const wave = keyframes`
  0% { transform: translateX(-100px) rotate(0deg); }
  100% { transform: translateX(100vw) rotate(360deg); }
`;

// Glow animation
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,0,0,0.1); }
  50% { box-shadow: 0 0 40px rgba(0,0,0,0.2); }
`;

const MotionText = motion(Text);
const MotionBox = motion(Box);

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
    <Box
      maxW="7xl"
      mx="auto"
      py={{ base: 16, md: 20 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="10%"
        left="-50px"
        w="100px"
        h="100px"
        borderRadius="full"
        bg="rgba(0,0,0,0.05)"
        animation={`${wave} 20s linear infinite`}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="20%"
        right="-30px"
        w="60px"
        h="60px"
        borderRadius="full"
        bg="rgba(0,0,0,0.03)"
        animation={`${wave} 25s linear infinite reverse`}
        zIndex={0}
      />

      {/* Floating Church Icons */}
      <Box
        position="absolute"
        top="15%"
        right="20%"
        zIndex={2}
        animation={`${float} 4s ease-in-out infinite`}
      >
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          bg="rgba(255,255,255,0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(0,0,0,0.1)"
          cursor="pointer"
          _hover={{
            animation: `${pulse} 1s ease-in-out infinite`,
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease"
        >
          <FaChurch size="16" color="#666" />
        </Box>
      </Box>

      <Box
        position="absolute"
        bottom="30%"
        left="15%"
        zIndex={2}
        animation={`${float} 5s ease-in-out infinite reverse`}
      >
        <Box
          w="35px"
          h="35px"
          borderRadius="full"
          bg="rgba(255,255,255,0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 20px rgba(0,0,0,0.1)"
          cursor="pointer"
          _hover={{
            animation: `${pulse} 1s ease-in-out infinite`,
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease"
        >
          <FaMapMarkerAlt size="14" color="#666" />
        </Box>
      </Box>

      {/* Modern grid layout */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 12, lg: 16 }}
        alignItems="center"
        minH="500px"
        position="relative"
        zIndex={1}
      >
        {/* Text Content */}
        <MotionBox
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <VStack
            spacing={8}
            textAlign={{ base: "center", lg: "left" }}
            align={{ base: "center", lg: "start" }}
          >
            {/* Title */}
            <Box position="relative">
              <Heading
                as="h2"
                size={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="extrabold"
                color={textColor}
                letterSpacing="tight"
                lineHeight="1.1"
                mb={4}
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

              {/* Decorative underline */}
              <Box
                position="absolute"
                bottom="-8px"
                left="0"
                w="60px"
                h="3px"
                bgGradient="linear(to-r, gray.400, silver)"
                borderRadius="full"
                animation={`${glow} 3s ease-in-out infinite`}
              />
            </Box>

            {/* Animated Rotating Text */}
            <Box position="relative" minH="120px" w="100%">
              <AnimatePresence mode="wait">
                <MotionText
                  key={index}
                  position="absolute"
                  w="100%"
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                  color={subText}
                  lineHeight="1.6"
                  fontFamily="monospace"
                  fontWeight="medium"
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                >
                  {content.mainRotatingTexts?.[index] || ""}
                </MotionText>
              </AnimatePresence>
            </Box>

            {/* Church Description */}
            <Box>
              <Heading
                as="h3"
                size={{ base: "lg", md: "xl" }}
                bgGradient="linear(to-r, silver, gray.400, black)"
                bgClip="text"
                mb={3}
              >
                {content.philippinesTitle || "LJIM – Philippines"}
              </Heading>

              <Text
                color={subText}
                fontSize={{ base: "md", lg: "lg" }}
                lineHeight="1.7"
                fontFamily="monospace"
                maxW="2xl"
              >
                {content.philippinesDescription ||
                  "In the heart of the Philippines, Lift Jesus International Ministries stands as a beacon of hope — spreading the Gospel, building communities of faith, and raising generations of believers devoted to Christ."}
              </Text>
            </Box>

            <Box
              p={6}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              bg={useColorModeValue("gray.50", "gray.900")}
              maxW="2xl"
            >
              <Text
                fontStyle="italic"
                fontFamily="monospace"
                color={verseColor}
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.6"
                textAlign="center"
              >
                {content.philippinesBibleVerse ||
                  '"From him the whole body, joined and held together by every supporting ligament, grows and builds itself up in love, as each part does its work." — Ephesians 4:16, NIV'}
              </Text>
            </Box>
          </VStack>
        </MotionBox>

        {/* Map Image */}
        <MotionBox
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
            transition="all 0.4s ease"
            _hover={{
              transform: "translateY(-8px) scale(1.02)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
            }}
            animation={`${glow} 4s ease-in-out infinite`}
          >
            {/* Interactive Connection Lines */}
            <Box
              position="absolute"
              top="20%"
              left="-20px"
              w="2px"
              h="60px"
              bgGradient="linear(to-b, gray.400, transparent)"
              animation={`${pulse} 2s ease-in-out infinite`}
              zIndex={2}
            />
            <Box
              position="absolute"
              bottom="30%"
              right="-20px"
              w="2px"
              h="40px"
              bgGradient="linear(to-t, gray.400, transparent)"
              animation={`${pulse} 2.5s ease-in-out infinite`}
              zIndex={2}
            />

            {/* Decorative overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-br, transparent 0%, rgba(0,0,0,0.1) 100%)"
              zIndex={1}
              pointerEvents="none"
            />

            {/* Floating particles */}
            <Box
              position="absolute"
              top="15%"
              right="10%"
              w="4px"
              h="4px"
              borderRadius="full"
              bg="rgba(255,255,255,0.6)"
              animation={`${float} 3s ease-in-out infinite`}
              zIndex={2}
            />
            <Box
              position="absolute"
              bottom="25%"
              left="8%"
              w="3px"
              h="3px"
              borderRadius="full"
              bg="rgba(255,255,255,0.4)"
              animation={`${float} 4s ease-in-out infinite reverse`}
              zIndex={2}
            />

            <OptimizedImage
              src={
                isDarkMode
                  ? content.philippinesMapImageDark ||
                    "/images/white-map-ph.png"
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
        </MotionBox>
      </Box>
    </Box>
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
