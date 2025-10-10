/**
 * Verse of the Day Component
 * Displays daily inspirational Bible verse with monochrome design
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Spinner,
  VStack,
  HStack,
  Icon,
  useToast,
  Fade,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBook, FaRedo, FaCopy, FaShareAlt } from "react-icons/fa";
import ChurchLoader from "../ChurchLoader";

const VerseOfTheDay = ({ showTitle = true, compact = false }) => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchDailyVerse();
  }, []);

  const fetchDailyVerse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bible/verse-of-the-day");
      const data = await response.json();

      if (data.success) {
        setVerse(data.data);
      } else {
        setError(data.error || "Failed to load verse");
      }
    } catch (err) {
      console.error("Error fetching verse:", err);
      setError("Failed to load verse of the day");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    // Fetch a random verse instead
    setLoading(true);
    try {
      const response = await fetch("/api/bible/random");
      const data = await response.json();

      if (data.success) {
        setVerse(data.data);
        toast({
          title: "New verse loaded!",
          status: "success",
          duration: 2000,
        });
      }
    } catch (err) {
      console.error("Error fetching random verse:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (verse) {
      const textToCopy = `"${verse.text}"\n\n- ${verse.reference} (${verse.translation})`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Verse copied to clipboard!",
        status: "success",
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    if (verse && navigator.share) {
      try {
        await navigator.share({
          title: "Verse of the Day",
          text: `"${verse.text}"\n\n- ${verse.reference} (${verse.translation})`,
        });
      } catch (err) {
        // If share fails, copy instead
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  // Monochrome color values
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(26, 26, 26, 0.95)"
  );
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = useColorModeValue("#A0A0A0", "#C0C0C0");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconBg = useColorModeValue("gray.100", "gray.800");
  const spinnerColor = useColorModeValue("gray.600", "gray.400");
  const buttonBg = useColorModeValue("gray.800", "gray.200");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.700", "gray.300");
  const decorativeBlob1Bg = useColorModeValue(
    "rgba(160, 160, 160, 0.08)",
    "rgba(192, 192, 192, 0.05)"
  );
  const decorativeBlob2Bg = useColorModeValue(
    "rgba(192, 192, 192, 0.06)",
    "rgba(160, 160, 160, 0.04)"
  );
  const iconButtonHoverBg = useColorModeValue("gray.200", "gray.700");

  if (loading) {
    return (
      <Box py={compact ? 6 : 12}>
        <Container maxW="container.lg">
          <Box
            bg={cardBg}
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            shadow="xl"
            px={8}
            py={12}
          >
            <ChurchLoader message="Loading verse of the day..." />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={compact ? 6 : 12}>
        <Container maxW="container.lg">
          <Box
            bg={cardBg}
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            shadow="xl"
            px={8}
            py={12}
          >
            <VStack spacing={4}>
              <Text color="red.500" fontWeight="medium">
                {error}
              </Text>
              <Button
                onClick={fetchDailyVerse}
                bg={buttonBg}
                color={buttonColor}
                _hover={{
                  bg: buttonHoverBg,
                }}
                size="md"
              >
                Try Again
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Fade in={!loading}>
      <Box py={compact ? 6 : 12} position="relative">
        <Container maxW="container.lg">
          <Box
            bg={cardBg}
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            shadow="xl"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative corner accents */}
            <Box
              position="absolute"
              top="-40px"
              right="-40px"
              width="150px"
              height="150px"
              borderRadius="full"
              bg={decorativeBlob1Bg}
              filter="blur(40px)"
            />
            <Box
              position="absolute"
              bottom="-40px"
              left="-40px"
              width="150px"
              height="150px"
              borderRadius="full"
              bg={decorativeBlob2Bg}
              filter="blur(40px)"
            />

            <VStack
              spacing={6}
              textAlign="center"
              px={{ base: 6, md: 12 }}
              py={{ base: 8, md: 12 }}
              position="relative"
              zIndex={1}
            >
              {showTitle && (
                <VStack spacing={3}>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={iconBg}
                    border="2px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaBook} boxSize={6} color={accentColor} />
                  </Box>
                  <Heading
                    size={compact ? "md" : "lg"}
                    fontWeight="bold"
                    color={textColor}
                    letterSpacing="tight"
                  >
                    Verse of the Day
                  </Heading>
                  <Box
                    w="60px"
                    h="2px"
                    bg={accentColor}
                    borderRadius="full"
                    opacity={0.6}
                  />
                </VStack>
              )}

              {verse && (
                <>
                  <VStack spacing={5} maxW="700px" w="100%">
                    <Text
                      fontSize={compact ? "lg" : "xl"}
                      fontWeight="medium"
                      lineHeight="tall"
                      fontStyle="italic"
                      color={textColor}
                      px={4}
                    >
                      &ldquo;{verse.text}&rdquo;
                    </Text>

                    <VStack spacing={2}>
                      <Text
                        fontSize={compact ? "md" : "lg"}
                        fontWeight="bold"
                        color={accentColor}
                        letterSpacing="wide"
                      >
                        — {verse.reference}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={textColor}
                        opacity={0.7}
                        fontWeight="medium"
                      >
                        {verse.translation}
                      </Text>
                    </VStack>
                  </VStack>

                  <HStack spacing={3} pt={2}>
                    <Tooltip label="Get another verse" placement="top">
                      <IconButton
                        icon={<FaRedo />}
                        onClick={handleRefresh}
                        bg={iconBg}
                        color={accentColor}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          bg: iconButtonHoverBg,
                          borderColor: accentColor,
                          transform: "translateY(-2px)",
                        }}
                        aria-label="Refresh verse"
                        isLoading={loading}
                        size={compact ? "sm" : "md"}
                        transition="all 0.2s"
                      />
                    </Tooltip>

                    <Tooltip label="Copy verse" placement="top">
                      <IconButton
                        icon={<FaCopy />}
                        onClick={handleCopy}
                        bg={iconBg}
                        color={accentColor}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          bg: iconButtonHoverBg,
                          borderColor: accentColor,
                          transform: "translateY(-2px)",
                        }}
                        aria-label="Copy verse"
                        size={compact ? "sm" : "md"}
                        transition="all 0.2s"
                      />
                    </Tooltip>

                    <Tooltip label="Share verse" placement="top">
                      <IconButton
                        icon={<FaShareAlt />}
                        onClick={handleShare}
                        bg={iconBg}
                        color={accentColor}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          bg: iconButtonHoverBg,
                          borderColor: accentColor,
                          transform: "translateY(-2px)",
                        }}
                        aria-label="Share verse"
                        size={compact ? "sm" : "md"}
                        transition="all 0.2s"
                      />
                    </Tooltip>
                  </HStack>
                </>
              )}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default VerseOfTheDay;
