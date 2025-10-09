/**
 * Bible Search Component
 * Search and lookup Bible verses with monochrome design
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Flex,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch, FaCopy, FaBook } from "react-icons/fa";
import { BIBLE_TRANSLATIONS } from "../../utils/bibleApi";

const BibleSearch = () => {
  const [reference, setReference] = useState("");
  const [translation, setTranslation] = useState("kjv");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!reference.trim()) {
      setError("Please enter a Bible reference");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch(
        `/api/bible/verse?reference=${encodeURIComponent(
          reference
        )}&translation=${translation}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResult(data.data);
      } else {
        setError(data.error || "Failed to find verse");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (searchResult) {
      const textToCopy = `"${searchResult.text}"\n\n- ${searchResult.reference} (${searchResult.translation})`;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Verse copied!",
        status: "success",
        duration: 2000,
      });
    }
  };

  const quickSearches = [
    "John 3:16",
    "Psalm 23",
    "Philippians 4:13",
    "Romans 8:28",
    "Jeremiah 29:11",
  ];

  // Monochrome color values
  const bgColor = useColorModeValue("white", "gray.900");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("#A0A0A0", "#C0C0C0");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const buttonBg = useColorModeValue("gray.800", "gray.200");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.700", "gray.300");
  const badgeBg = useColorModeValue("gray.100", "gray.700");
  const badgeColor = useColorModeValue("gray.700", "gray.300");
  const badgeHoverBg = useColorModeValue("gray.200", "gray.600");
  const resultCardBorder = useColorModeValue("gray.400", "gray.500");

  return (
    <Box py={16} bg={bgColor}>
      <Container maxW="container.lg">
        <VStack spacing={10}>
          <VStack spacing={4} textAlign="center">
            <Box
              p={3}
              borderRadius="xl"
              bg={useColorModeValue("gray.100", "gray.800")}
              border="2px solid"
              borderColor={cardBorder}
            >
              <FaBook size={32} color={accentColor} />
            </Box>
            <Heading size="xl" color={headingColor} fontWeight="bold">
              Bible Search
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="600px">
              Search for any Bible verse or passage
            </Text>
          </VStack>

          {/* Search Form */}
          <Card
            w="100%"
            shadow="lg"
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
          >
            <CardBody>
              <form onSubmit={handleSearch}>
                <VStack spacing={4}>
                  <HStack
                    w="100%"
                    spacing={4}
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <Input
                      placeholder="Enter reference (e.g., John 3:16, Psalm 23:1-6)"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      size="lg"
                      flex={1}
                      bg={inputBg}
                      borderColor={inputBorder}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                    <Select
                      value={translation}
                      onChange={(e) => setTranslation(e.target.value)}
                      size="lg"
                      w={{ base: "100%", md: "250px" }}
                      bg={inputBg}
                      borderColor={inputBorder}
                      _hover={{ borderColor: accentColor }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    >
                      {BIBLE_TRANSLATIONS.map((trans) => (
                        <option key={trans.id} value={trans.id}>
                          {trans.name}
                        </option>
                      ))}
                    </Select>
                    <Button
                      type="submit"
                      bg={buttonBg}
                      color={buttonColor}
                      size="lg"
                      leftIcon={<FaSearch />}
                      isLoading={loading}
                      w={{ base: "100%", md: "auto" }}
                      _hover={{ bg: buttonHoverBg }}
                      transition="all 0.3s"
                    >
                      Search
                    </Button>
                  </HStack>

                  {/* Quick Searches */}
                  <Box w="100%">
                    <Text fontSize="sm" color={textColor} mb={2}>
                      Quick searches:
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                      {quickSearches.map((verse) => (
                        <Badge
                          key={verse}
                          bg={badgeBg}
                          color={badgeColor}
                          px={3}
                          py={1}
                          borderRadius="full"
                          cursor="pointer"
                          border="1px solid"
                          borderColor={cardBorder}
                          _hover={{
                            bg: badgeHoverBg,
                            borderColor: accentColor,
                          }}
                          onClick={() => {
                            setReference(verse);
                            setError(null);
                          }}
                          transition="all 0.2s"
                        >
                          {verse}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert
              status="error"
              borderRadius="md"
              bg={useColorModeValue("red.50", "red.900")}
              color={useColorModeValue("red.800", "red.200")}
              borderLeft="4px solid"
              borderColor="red.500"
            >
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Search Results */}
          {searchResult && (
            <Card
              w="100%"
              shadow="xl"
              borderTop="4px"
              borderColor={resultCardBorder}
              bg={cardBg}
            >
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Heading size="md" color={headingColor} fontWeight="bold">
                        {searchResult.reference}
                      </Heading>
                      <Text fontSize="sm" color={textColor}>
                        {searchResult.translation}
                      </Text>
                    </VStack>
                    <Tooltip label="Copy verse">
                      <IconButton
                        icon={<FaCopy />}
                        onClick={handleCopy}
                        bg={useColorModeValue("gray.100", "gray.700")}
                        color={accentColor}
                        _hover={{
                          bg: useColorModeValue("gray.200", "gray.600"),
                        }}
                        variant="ghost"
                        aria-label="Copy verse"
                      />
                    </Tooltip>
                  </HStack>

                  <Divider borderColor={cardBorder} />

                  {/* Display verses */}
                  {searchResult.verses && searchResult.verses.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {searchResult.verses.map((verse, index) => (
                        <HStack key={index} align="start" spacing={3}>
                          <Badge
                            bg={badgeBg}
                            color={badgeColor}
                            fontSize="sm"
                            mt={1}
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {verse.verse}
                          </Badge>
                          <Text
                            fontSize="lg"
                            lineHeight="tall"
                            color={headingColor}
                          >
                            {verse.text}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="lg" lineHeight="tall" color={headingColor}>
                      {searchResult.text}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <VStack spacing={4}>
              <Spinner
                size="xl"
                color={accentColor}
                thickness="4px"
                speed="0.8s"
              />
              <Text color={textColor} fontWeight="medium">
                Searching Bible...
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BibleSearch;
