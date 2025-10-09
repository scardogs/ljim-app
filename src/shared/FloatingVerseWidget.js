/**
 * Floating Verse of the Day Widget
 * Slide-out panel that shows daily Bible verse
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Heading,
  Spinner,
  Button,
  Tooltip,
  HStack,
  Icon,
  useDisclosure,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaBook, FaRedo, FaCopy, FaShareAlt } from "react-icons/fa";

const FloatingVerseWidget = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Color values
  const buttonBg = useColorModeValue("gray.800", "gray.200");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.700", "gray.300");
  const drawerBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = useColorModeValue("#A0A0A0", "#C0C0C0");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconBg = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    if (isOpen && !verse) {
      fetchDailyVerse();
    }
  }, [isOpen]);

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
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Tooltip label="Verse of the Day" placement="right">
        <IconButton
          icon={<FaBook />}
          onClick={onOpen}
          position="fixed"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          zIndex={999}
          bg={buttonBg}
          color={buttonColor}
          size="lg"
          borderRadius="full"
          boxShadow="xl"
          _hover={{
            bg: buttonHoverBg,
            transform: "translateY(-50%) scale(1.1)",
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          aria-label="Open Verse of the Day"
          border="2px solid"
          borderColor={useColorModeValue("gray.300", "gray.600")}
        />
      </Tooltip>

      {/* Slide-out Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={drawerBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <VStack spacing={3} align="center" py={4}>
              <Box
                p={3}
                borderRadius="xl"
                bg={iconBg}
                border="2px solid"
                borderColor={borderColor}
              >
                <Icon as={FaBook} boxSize={6} color={accentColor} />
              </Box>
              <Heading size="md" color={textColor} fontWeight="bold">
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
          </DrawerHeader>

          <DrawerBody>
            {loading && (
              <VStack spacing={4} py={12}>
                <Spinner size="xl" color={accentColor} thickness="4px" />
                <Text color={accentColor} fontWeight="medium">
                  Loading verse...
                </Text>
              </VStack>
            )}

            {error && !loading && (
              <VStack spacing={4} py={12}>
                <Text color="red.500" fontWeight="medium">
                  {error}
                </Text>
                <Button
                  onClick={fetchDailyVerse}
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{ bg: buttonHoverBg }}
                  size="md"
                >
                  Try Again
                </Button>
              </VStack>
            )}

            {verse && !loading && (
              <VStack spacing={8} py={6}>
                {/* Verse Content */}
                <Box
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue(
                    "rgba(0, 0, 0, 0.02)",
                    "rgba(255, 255, 255, 0.05)"
                  )}
                  border="1px solid"
                  borderColor={borderColor}
                  w="100%"
                >
                  <VStack spacing={4}>
                    <Text
                      fontFamily="monospace"
                      fontSize="lg"
                      fontWeight="medium"
                      lineHeight="tall"
                      fontStyle="italic"
                      color={textColor}
                      textAlign="center"
                    >
                      &ldquo;{verse.text}&rdquo;
                    </Text>

                    <Box
                      w="60px"
                      h="2px"
                      bg={accentColor}
                      borderRadius="full"
                      opacity={0.5}
                    />

                    <VStack spacing={1}>
                      <Text
                        fontSize="md"
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
                </Box>

                {/* Action Buttons */}
                <VStack spacing={3} w="100%">
                  <Button
                    leftIcon={<FaRedo />}
                    onClick={handleRefresh}
                    bg={iconBg}
                    color={textColor}
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      bg: useColorModeValue("gray.200", "gray.700"),
                      borderColor: accentColor,
                    }}
                    isLoading={loading}
                    w="100%"
                    transition="all 0.2s"
                  >
                    Get Another Verse
                  </Button>

                  <HStack spacing={3} w="100%">
                    <Button
                      leftIcon={<FaCopy />}
                      onClick={handleCopy}
                      bg={iconBg}
                      color={textColor}
                      border="1px solid"
                      borderColor={borderColor}
                      _hover={{
                        bg: useColorModeValue("gray.200", "gray.700"),
                        borderColor: accentColor,
                      }}
                      flex={1}
                      transition="all 0.2s"
                    >
                      Copy
                    </Button>

                    <Button
                      leftIcon={<FaShareAlt />}
                      onClick={handleShare}
                      bg={iconBg}
                      color={textColor}
                      border="1px solid"
                      borderColor={borderColor}
                      _hover={{
                        bg: useColorModeValue("gray.200", "gray.700"),
                        borderColor: accentColor,
                      }}
                      flex={1}
                      transition="all 0.2s"
                    >
                      Share
                    </Button>
                  </HStack>
                </VStack>

                {/* Info Text */}
                <Text
                  fontSize="xs"
                  color={textColor}
                  opacity={0.6}
                  textAlign="center"
                  px={4}
                >
                  Click refresh to get a random verse, or visit the Bible page
                  for more features
                </Text>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FloatingVerseWidget;


