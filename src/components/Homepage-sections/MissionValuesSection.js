import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  IconButton,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  SunIcon,
  ChatIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import ChurchLoader from "../ChurchLoader";

export default function MissionValuesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [content, setContent] = useState(null);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgPattern = useColorModeValue(
    `
    repeating-linear-gradient(
      0deg,
      white,
      white 9px,
      black 9px,
      black 10px
    ),
    repeating-linear-gradient(
      90deg,
      white,
      white 9px,
      black 9px,
      black 10px
    )
  `,
    "black"
  );

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Icon mapping
  const iconMap = {
    StarIcon: StarIcon,
    SunIcon: SunIcon,
    ChatIcon: ChatIcon,
    CheckCircleIcon: CheckCircleIcon,
  };

  // Get cards from content or use defaults
  const cards = content?.missionValues || [];

  const nextSlide = React.useCallback(() => {
    if (!isAnimating && cards.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, cards.length]);

  const prevSlide = () => {
    if (!isAnimating && cards.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    if (cards.length === 0) return;
    const interval = setInterval(nextSlide, 2500);
    return () => clearInterval(interval);
  }, [nextSlide, cards.length]);

  // Show loading state
  if (!content || cards.length === 0) {
    return (
      <Flex w="100vw" minH="500px" justify="center" align="center">
        <ChurchLoader message="Loading mission & values..." />
      </Flex>
    );
  }

  const currentCard = cards[currentIndex];
  const IconComponent = iconMap[currentCard.icon] || StarIcon;

  return (
    <Box
      w="100vw"
      h="50vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgPattern}
      p={4}
      position="relative"
    >
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={8} />}
        position="absolute"
        left={{ base: 2, md: 8 }}
        zIndex={2}
        onClick={prevSlide}
        colorScheme="gray"
        variant="ghost"
        size="lg"
        _hover={{ bg: glassBg, transform: "scale(1.1)" }}
      />

      <Box
        w="full"
        maxW="4xl"
        bg={glassBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        backdropFilter="blur(12px)"
        boxShadow="xl"
        p={{ base: 8, md: 10 }}
        textAlign="left"
        transition="all 0.3s ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
        position="relative"
        overflow="hidden"
      >
        <Box
          key={currentIndex}
          animation={isAnimating ? "fadeIn 0.5s ease-in-out" : "none"}
        >
          <Box display="flex" alignItems="center" mb={6}>
            <Box
              as={IconComponent}
              boxSize={10}
              color={currentCard.color}
              mr={4}
            />
            <Heading
              size="lg"
              color={textColor}
              borderLeft="4px solid"
              borderColor={currentCard.color}
              pl={4}
            >
              {currentCard.title}
            </Heading>
          </Box>

          <Text
            fontFamily="monospace"
            color={subText}
            fontSize="lg"
            lineHeight="tall"
          >
            {currentCard.description}
          </Text>
        </Box>

        <Box display="flex" justifyContent="center" gap={2} mt={8}>
          {cards.map((_, index) => (
            <Box
              key={index}
              w={currentIndex === index ? 8 : 2}
              h={2}
              bg={currentIndex === index ? currentCard.color : "gray.400"}
              borderRadius="full"
              transition="all 0.3s ease"
              cursor="pointer"
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              opacity={currentIndex === index ? 1 : 0.5}
              _hover={{ opacity: 1 }}
            />
          ))}
        </Box>
      </Box>

      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={8} />}
        position="absolute"
        right={{ base: 2, md: 8 }}
        zIndex={2}
        onClick={nextSlide}
        colorScheme="gray"
        variant="ghost"
        size="lg"
        _hover={{ bg: glassBg, transform: "scale(1.1)" }}
      />

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </Box>
  );
}
