import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Button, Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function HeroSection() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [displayedText, setDisplayedText] = useState("");

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!content?.heroSubtitle) return;

    let index = 0;
    setDisplayedText(""); // Reset text
    const interval = setInterval(() => {
      setDisplayedText(content.heroSubtitle.slice(0, index));
      index++;
      if (index > content.heroSubtitle.length) clearInterval(interval);
    }, 40); // typing speed (ms per letter)
    return () => clearInterval(interval);
  }, [content?.heroSubtitle]);

  // Show loading state while fetching
  if (!content) {
    return (
      <Box
        position="relative"
        width="100%"
        height="calc(100vh - 80px)"
        mt="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.900"
      >
        <Text color="white">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      width="100%"
      height="calc(100vh - 80px)" // full height minus navbar
      mt="80px"
      bgImage={`url('${content.heroImage || "/images/Untitled design.png"}')`}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      filter="grayscale(100%) brightness(0.85)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
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
            {content.heroTitle || "Lift Jesus International Ministries"}
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
          {content.heroButtonText || "Learn More"}
        </Button>
      </VStack>
    </Box>
  );
}
