import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import OptimizedImage from "../OptimizedImage";

const MotionBox = motion(Box);

export default function About() {
  const [content, setContent] = React.useState(null);

  const bg = useColorModeValue(
    "linear(to-b, white, gray.100)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue(
    "rgba(255,255,255,0.85)",
    "rgba(0,0,0,0.45)"
  );
  const gradientText = useColorModeValue(
    "linear(to-r, gray.400, gray.600, black)",
    "linear(to-r, gray.300, gray.500, white)"
  );
  const dividerBorderColor = useColorModeValue("gray.300", "gray.700");
  const fontFamily = "monospace";

  // Fetch content from database
  React.useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching about content:", err));
  }, []);

  // Show loading state
  if (!content) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      textAlign="center"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      fontFamily={fontFamily}
    >
      <VStack spacing={12} maxW="7xl" mx="auto">
        {/* Founder Section */}
        <MotionBox
          borderRadius="2xl"
          p={{ base: 6, md: 12 }}
          w="100%"
          boxShadow="xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
        >
          <HStack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            align="center"
          >
            <Box
              borderRadius="full"
              boxSize={{ base: "150px", md: "200px" }}
              overflow="hidden"
              boxShadow="lg"
            >
              <OptimizedImage
                src={content.founderImage || "/images/ed-fernandez.jpg"}
                alt={content.founderName || "Bishop Ed Dalisay Fernandez"}
                width={200}
                height={200}
                crop="thumb"
                gravity="faces"
                quality="auto"
                format="auto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box textAlign={{ base: "center", md: "left" }}>
              <Heading
                bgGradient={gradientText}
                bgClip="text"
                fontSize={{ base: "2xl", md: "3xl" }}
                mb={3}
                fontFamily={fontFamily}
              >
                {content.founderName || "Bishop Ed Dalisay Fernandez"}
              </Heading>
              <Text color={subTextColor} fontSize={{ base: "md", md: "lg" }}>
                {content.founderBio ||
                  "Bishop Ed Dalisay Fernandez is the founder and spiritual leader of Lift Jesus International Ministries."}
              </Text>
            </Box>
          </HStack>
        </MotionBox>

        {/* Main About Heading */}
        <MotionBox
          bg={sectionBg}
          borderRadius="2xl"
          p={{ base: 6, md: 12 }}
          w="100%"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          boxShadow="xl"
          _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
        >
          <Heading
            bgGradient={gradientText}
            bgClip="text"
            fontSize={{ base: "3xl", md: "4xl" }}
            mb={4}
            fontFamily={fontFamily}
          >
            {content.aboutTitle || "About LJIM"}
          </Heading>
          <Text color={subTextColor} fontSize={{ base: "md", md: "lg" }}>
            {content.aboutDescription ||
              "Lift Jesus International Ministries (LJIM) is a Christ-centered global fellowship committed to spreading the message of salvation through faith in Jesus Christ."}
          </Text>
        </MotionBox>

        {/* Our Story & Mission Section (Horizontal on large screens) */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={8}
          w="full"
          alignItems="stretch"
        >
          <MotionBox
            bg={sectionBg}
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Heading
              bgGradient={gradientText}
              bgClip="text"
              fontSize="2xl"
              mb={3}
              fontFamily={fontFamily}
            >
              {content.storyTitle || "Our Story"}
            </Heading>
            <Text color={subTextColor} fontSize="md">
              {content.storyContent ||
                "Founded to uplift communities through faith, LJIM strives to transform lives with love, compassion, and biblical teachings."}
            </Text>
          </MotionBox>

          <MotionBox
            bg={sectionBg}
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Heading
              bgGradient={gradientText}
              bgClip="text"
              fontSize="2xl"
              mb={3}
              fontFamily={fontFamily}
            >
              {content.missionTitle || "Our Mission"}
            </Heading>
            <Text color={subTextColor} fontSize="md">
              {content.missionContent ||
                "To bring spiritual transformation worldwide, empower believers, and serve communities through meaningful outreach programs and initiatives."}
            </Text>
          </MotionBox>

          <MotionBox
            bg={sectionBg}
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Heading
              bgGradient={gradientText}
              bgClip="text"
              fontSize="2xl"
              mb={3}
              fontFamily={fontFamily}
            >
              {content.visionTitle || "Our Vision"}
            </Heading>
            <Text color={subTextColor} fontSize="md">
              {content.visionContent ||
                "A world transformed by the Gospel, reflecting God's love, peace, and justice. Equipping believers to shine as lights in every community."}
            </Text>
          </MotionBox>

          <MotionBox
            bg={sectionBg}
            borderRadius="xl"
            p={8}
            boxShadow="lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Heading
              bgGradient={gradientText}
              bgClip="text"
              fontSize="2xl"
              mb={3}
              fontFamily={fontFamily}
            >
              {content.valuesTitle || "Core Values"}
            </Heading>
            <Text color={subTextColor} fontSize="md">
              {content.valuesContent ||
                "Faith, community, service, and evangelism. These values guide our ministry as we spread the message of salvation and serve the world."}
            </Text>
          </MotionBox>
        </SimpleGrid>

        <Divider borderColor={dividerBorderColor} />
        <Text color={subTextColor} fontSize="sm">
          © {new Date().getFullYear()} Lift Jesus Worldwide Ministries. All
          Rights Reserved.
        </Text>
      </VStack>
    </Box>
  );
}
