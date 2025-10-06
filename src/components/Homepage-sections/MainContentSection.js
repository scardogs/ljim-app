import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";

// Gentle shimmer
const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const MotionText = motion(Text);

export default function IntroSection() {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");

  // 🟢 Dynamically choose map image based on color mode
  const mapImage = useColorModeValue(
    "/images/map-ph.png",
    "/images/white-map-ph.png"
  );

  const textVariants = [
    "A fellowship of believers devoted to exalting Jesus Christ, preaching His Word, and transforming lives through worship, discipleship, and service.",
    "Together, we lift His name higher in every nation and glorify Him through unity and love.",
    "Empowered by the Spirit, we reach out to the world with faith, hope, and compassion.",
    "Our mission: to shine the light of Christ and make His presence known in every generation.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % textVariants.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [textVariants.length]);

  return (
    <Box
      w="100%"
      minH="120vh"
      bg="black"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={6}
      bgGradient={useColorModeValue(
        "linear(to-b, white, gray.100)",
        "linear(to-b, gray.900, black)"
      )}
    >
      <VStack spacing={8} maxW="3xl" textAlign="center">
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
              {textVariants[index]}
            </MotionText>
          </AnimatePresence>
        </Box>

        {/* 🗺️ Map Image — changes automatically in dark/light mode */}
        <Box mt={12} w={{ base: "90%", md: "700px" }}>
          <Image
            src={mapImage}
            alt="Philippines Map"
            borderRadius="2xl"
            boxShadow="0 0 25px rgba(255,255,255,0.1)"
            transition="transform 1.5s ease, box-shadow 1.5s ease"
            _hover={{
              transform: "scale(1.03)",
              boxShadow: "0 0 35px rgba(255,255,255,0.2)",
            }}
          />
        </Box>

        {/* Church Description */}
        <VStack spacing={4} mt={10} maxW="3xl">
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-r, silver, gray.400, black)"
            bgClip="text"
          >
            Lift Jesus International Ministries – Philippines
          </Heading>

          <Text
            color={subText}
            fontSize="md"
            lineHeight="1.8"
            fontFamily="monospace"
          >
            In the heart of the Philippines, Lift Jesus International Ministries
            stands as a beacon of hope — spreading the Gospel, building
            communities of faith, and raising generations of believers devoted
            to Christ. From city streets to remote villages, the message of His
            love continues to transform lives.
          </Text>

          {/* Verse */}
          <Text
            fontStyle="italic"
            fontFamily="monospace"
            color={useColorModeValue("gray.700", "gray.300")}
            fontSize="sm"
            mt={4}
          >
            “From him the whole body, joined and held together by every
            supporting ligament, grows and builds itself up in love, as each
            part does its work.” — <b>Ephesians 4:16, NIV</b>
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
