import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Button, Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";
import OptimizedImage from "../OptimizedImage";
import { SectionChurchLoader } from "../ChurchLoader";
import { useHomepageContent } from "../../contexts/HomepageContext";

export default function HeroSection() {
  const router = useRouter();
  const { content, loading, error } = useHomepageContent();
  const [displayedText, setDisplayedText] = useState("");

  // Use default content if no content is available yet
  const displayContent = content || {
    heroTitle: "LJIM",
    heroSubtitle: "Living Jesus in Me",
    heroImage: "/images/ljim-logo.png",
  };

  // Typing animation effect
  useEffect(() => {
    if (!displayContent?.heroSubtitle) return;

    let index = 0;
    setDisplayedText(""); // Reset text
    const interval = setInterval(() => {
      setDisplayedText(displayContent.heroSubtitle.slice(0, index));
      index++;
      if (index > displayContent.heroSubtitle.length) clearInterval(interval);
    }, 40); // typing speed (ms per letter)
    return () => clearInterval(interval);
  }, [displayContent?.heroSubtitle]);

  // Show error state
  if (error) {
    return (
      <Box
        position="relative"
        width="100%"
        height="calc(100vh - 80px)"
        mt="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="red.500">Error loading content: {error}</Text>
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      width="100%"
      height="calc(100vh - 80px)" // full height minus navbar
      mt="80px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Background Media (Image/Video/GIF) using Cloudinary */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        filter="grayscale(100%) brightness(0.85)"
        overflow="hidden"
        zIndex="0"
      >
        {displayContent.heroMediaType === "video" ||
        displayContent.heroMediaType === "gif" ? (
          // Video or GIF Background
          displayContent.heroVideoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={displayContent.heroVideoUrl} type="video/mp4" />
              Your browser does not support video backgrounds.
            </video>
          ) : (
            <Box w="100%" h="100%" bg="gray.900" />
          )
        ) : // Image Background
        displayContent.heroImage ? (
          <OptimizedImage
            src={displayContent.heroImage}
            alt={displayContent.heroTitle || "Hero Image"}
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
            }}
          />
        ) : (
          <Box w="100%" h="100%" bg="gray.900" />
        )}
      </Box>
      {/* Overlay tint */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex="1"
      />

      {/* Hero Content */}
      <VStack spacing={6} zIndex="2" color="white" textAlign="center" px={6}>
        <Fade in>
          <Heading
            as="h1"
            size="3xl"
            fontWeight="bold"
            textShadow="2px 2px 10px rgba(0,0,0,0.8)"
          >
            {displayContent.heroTitle || "Lift Jesus International Ministries"}
          </Heading>
        </Fade>

        <Text
          fontSize="xl"
          maxW="2xl"
          minH="80px" // prevents layout shift while typing
          whiteSpace="pre-wrap"
          fontFamily="monospace"
          borderRight="2px solid white"
          display="inline-block"
          overflow="hidden"
          animation="blink 0.8s infinite"
          sx={{
            "@keyframes blink": {
              "0%, 50%": { borderColor: "transparent" },
              "50%, 100%": { borderColor: "white" },
            },
          }}
        >
          {displayedText}
        </Text>

        <Button
          size="lg"
          bg="whiteAlpha.800"
          color="black"
          borderRadius="full"
          _hover={{ bg: "gray.200" }}
          onClick={() => router.push("/about")}
        >
          {displayContent.heroButtonText || "Learn More"}
        </Button>
      </VStack>
    </Box>
  );
}
