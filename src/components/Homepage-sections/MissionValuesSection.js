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
import OptimizedImage from "../OptimizedImage";
import ChurchLoader from "../ChurchLoader";

export default function MissionValuesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [content, setContent] = useState(null);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.92)",
    "rgba(0,0,0,0.85)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const defaultBgPattern = useColorModeValue(
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
  // All overlay colors defined at top
  const overlayBg = useColorModeValue(
    "rgba(255, 255, 255, 0.3)",
    "rgba(0, 0, 0, 0.4)"
  );
  const navButtonBg = useColorModeValue(
    "rgba(255,255,255,0.92)",
    "rgba(0,0,0,0.85)"
  );
  const iconBoxBg = useColorModeValue("gray.100", "gray.800");
  const bgOverlayForSx = useColorModeValue("", "rgba(0, 0, 0, 0.75)");

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
  const mediaType = content?.missionValuesMediaType || "pattern";
  const mediaUrl =
    content?.missionValuesMediaUrl ||
    content?.missionValuesBackgroundImage ||
    "";

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
      minH="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
      sx={
        mediaType !== "pattern" && mediaUrl
          ? {
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {/* Background Layer - Contained within section */}
      {mediaType === "pattern" ? (
        /* Default pattern background */
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={defaultBgPattern}
          zIndex={0}
        />
      ) : mediaType === "video" || mediaType === "gif" ? (
        /* Video/GIF Background - Contained in section */
        mediaUrl && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={0}
            overflow="hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "100%",
                minHeight: "100%",
                filter: "grayscale(100%) brightness(0.85)",
              }}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support video backgrounds.
            </video>

            {/* Overlay for readability */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg={bgOverlayForSx}
              backdropFilter="blur(3px)"
              zIndex={1}
            />
          </Box>
        )
      ) : (
        /* Image Background - Contained in section */
        mediaUrl && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={0}
            overflow="hidden"
          >
            <Box position="absolute" top={0} left={0} right={0} bottom={0}>
              <OptimizedImage
                src={mediaUrl}
                alt="Mission & Values Background"
                width={1920}
                height={1080}
                crop="fill"
                gravity="center"
                quality="auto"
                format="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) brightness(0.85)",
                }}
              />
            </Box>

            {/* Overlay for readability */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg={overlayBg}
              backdropFilter="blur(1px)"
              zIndex={1}
            />
          </Box>
        )
      )}

      {/* Navigation Buttons */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={8} />}
        position="absolute"
        left={{ base: 2, md: 8 }}
        zIndex={3}
        onClick={prevSlide}
        colorScheme="gray"
        variant="ghost"
        size="lg"
        bg={glassBg}
        backdropFilter="blur(10px)"
        _hover={{ transform: "scale(1.1)", boxShadow: "xl" }}
        transition="all 0.2s"
      />

      {/* Content Card */}
      <Box
        w="full"
        maxW="4xl"
        bg={glassBg}
        borderRadius="3xl"
        borderWidth="1px"
        borderColor={borderColor}
        backdropFilter="blur(20px) saturate(180%)"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
        p={{ base: 8, md: 12 }}
        textAlign="left"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-6px)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
        }}
        position="relative"
        overflow="hidden"
        zIndex={2}
      >
        {/* Decorative top accent */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bgGradient="linear(to-r, gray.400, silver, gray.400)"
          opacity={0.7}
        />

        {/* Card Content */}
        <Box
          key={currentIndex}
          animation={isAnimating ? "fadeIn 0.5s ease-in-out" : "none"}
        >
          <Flex alignItems="center" mb={6} gap={4}>
            <Flex
              boxSize={16}
              borderRadius="2xl"
              bg={iconBoxBg}
              align="center"
              justify="center"
              borderWidth="2px"
              borderColor={currentCard.color}
              position="relative"
            >
              <Box as={IconComponent} boxSize={8} color={currentCard.color} />
              {/* Icon glow */}
              <Box
                position="absolute"
                w="100%"
                h="100%"
                borderRadius="2xl"
                bg={currentCard.color}
                filter="blur(15px)"
                opacity={0.3}
                zIndex={-1}
              />
            </Flex>

            <Box flex="1">
              <Heading
                size="xl"
                color={textColor}
                fontFamily="monospace"
                letterSpacing="tight"
              >
                {currentCard.title}
              </Heading>
              <Box
                w="60px"
                h="3px"
                bg={currentCard.color}
                borderRadius="full"
                mt={2}
              />
            </Box>
          </Flex>

          <Text
            fontFamily="monospace"
            color={subText}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="tall"
          >
            {currentCard.description}
          </Text>
        </Box>

        {/* Pagination Dots */}
        <Flex justifyContent="center" gap={2} mt={8}>
          {cards.map((_, index) => (
            <Box
              key={index}
              w={currentIndex === index ? 10 : 2.5}
              h={2.5}
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
              _hover={{ opacity: 1, transform: "scale(1.1)" }}
            />
          ))}
        </Flex>
      </Box>

      {/* Next Button */}
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={8} />}
        position="absolute"
        right={{ base: 2, md: 8 }}
        zIndex={3}
        onClick={nextSlide}
        colorScheme="gray"
        variant="ghost"
        size="lg"
        bg={navButtonBg}
        backdropFilter="blur(10px)"
        _hover={{ transform: "scale(1.1)", boxShadow: "xl" }}
        transition="all 0.2s"
      />

      {/* Fade-in animation */}
      <style jsx global>
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
