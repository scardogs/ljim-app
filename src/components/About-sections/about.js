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
  Container,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { FiBook, FiTarget, FiEye, FiHeart } from "react-icons/fi";
import OptimizedImage from "../OptimizedImage";
import ChurchLoader from "../ChurchLoader";

const MotionBox = motion(Box);

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Background shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

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
        bgGradient={bg}
      >
        <ChurchLoader message="Loading about content..." />
      </Box>
    );
  }

  const iconMap = {
    story: FiBook,
    mission: FiTarget,
    vision: FiEye,
    values: FiHeart,
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundSize="40px 40px"
        backgroundImage="linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)"
        opacity={0.05}
        zIndex={0}
      />

      <Container
        maxW="7xl"
        py={{ base: 16, md: 24 }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={16}>
          {/* Page Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, gray.400, silver, black)"
              bgClip="text"
              animation={`${shimmer} 6s ease-in-out infinite`}
              backgroundSize="200% auto"
              fontFamily={fontFamily}
            >
              {content.aboutTitle || "About LJIM"}
            </Heading>
            <Text
              color={subTextColor}
              fontSize={{ base: "lg", md: "xl" }}
              maxW="3xl"
              fontFamily={fontFamily}
            >
              {content.aboutDescription ||
                "Lift Jesus International Ministries (LJIM) is a Christ-centered global fellowship committed to spreading the message of salvation through faith in Jesus Christ."}
            </Text>
            <Divider
              w="100px"
              borderColor="gray.400"
              borderWidth="2px"
              borderRadius="full"
              opacity={0.6}
              mt={4}
            />
          </VStack>

          {/* Founder Section - Full Image Hero Style */}
          <MotionBox
            w="100%"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              bg={sectionBg}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
              backdropFilter="blur(10px)"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align="stretch"
                minH={{ base: "auto", md: "400px" }}
              >
                {/* Full Founder Image */}
                <Box
                  w={{ base: "100%", md: "45%" }}
                  h={{ base: "400px", md: "auto" }}
                  position="relative"
                  overflow="hidden"
                >
                  <OptimizedImage
                    src={content.founderImage || "/images/ed-fernandez.jpg"}
                    alt={content.founderName || "Bishop Ed Dalisay Fernandez"}
                    width={600}
                    height={600}
                    crop="fill"
                    gravity="faces"
                    quality="auto"
                    format="auto"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                    }}
                  />
                  {/* Gradient overlay */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="50%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
                    display={{ base: "block", md: "none" }}
                  />
                </Box>

                {/* Founder Content */}
                <VStack
                  w={{ base: "100%", md: "55%" }}
                  p={{ base: 8, md: 12 }}
                  align="start"
                  justify="center"
                  spacing={6}
                >
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={subTextColor}
                      textTransform="uppercase"
                      letterSpacing="wider"
                      fontFamily={fontFamily}
                    >
                      Founder & Spiritual Leader
                    </Text>
                    <Heading
                      as="h2"
                      fontSize={{ base: "3xl", md: "4xl" }}
                      fontWeight="bold"
                      bgGradient={gradientText}
                      bgClip="text"
                      fontFamily={fontFamily}
                    >
                      {content.founderName || "Bishop Ed Dalisay Fernandez"}
                    </Heading>
                  </VStack>

                  <Text
                    color={subTextColor}
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="tall"
                    textAlign="left"
                    fontFamily={fontFamily}
                  >
                    {content.founderBio ||
                      "Bishop Ed Dalisay Fernandez is the founder and spiritual leader of Lift Jesus International Ministries. His ministry journey is marked by faith, humility, and a passion for evangelism."}
                  </Text>

                  <Divider borderColor={dividerBorderColor} />

                  <HStack spacing={4}>
                    <Box w="4px" h="40px" bg="gray.400" borderRadius="full" />
                    <Text
                      fontSize="md"
                      fontStyle="italic"
                      color={subTextColor}
                      fontFamily={fontFamily}
                    >
                      &ldquo;Lifting Jesus higher in every nation&rdquo;
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
            </Box>
          </MotionBox>

          {/* Four Info Cards - Modern Icon-Based Layout */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {/* Our Story */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Box
                bg={sectionBg}
                borderRadius="xl"
                p={6}
                h="full"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                }}
                transition="all 0.3s"
                borderWidth="1px"
                borderColor={dividerBorderColor}
              >
                {/* Icon */}
                <Flex
                  w="50px"
                  h="50px"
                  borderRadius="lg"
                  bg="gray.700"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <Icon as={FiBook} boxSize={6} color="white" />
                </Flex>

                <Heading
                  size="md"
                  mb={3}
                  color={textColor}
                  fontFamily={fontFamily}
                >
                  {content.storyTitle || "Our Story"}
                </Heading>
                <Text color={subTextColor} fontSize="sm" lineHeight="tall">
                  {content.storyContent ||
                    "Founded to uplift communities through faith, LJIM strives to transform lives with love, compassion, and biblical teachings."}
                </Text>

                {/* Decorative accent */}
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient="radial(gray.200, transparent)"
                  opacity={0.3}
                  pointerEvents="none"
                />
              </Box>
            </MotionBox>

            {/* Our Mission */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                bg={sectionBg}
                borderRadius="xl"
                p={6}
                h="full"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                }}
                transition="all 0.3s"
                borderWidth="1px"
                borderColor={dividerBorderColor}
              >
                <Flex
                  w="50px"
                  h="50px"
                  borderRadius="lg"
                  bg="gray.600"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <Icon as={FiTarget} boxSize={6} color="white" />
                </Flex>

                <Heading
                  size="md"
                  mb={3}
                  color={textColor}
                  fontFamily={fontFamily}
                >
                  {content.missionTitle || "Our Mission"}
                </Heading>
                <Text color={subTextColor} fontSize="sm" lineHeight="tall">
                  {content.missionContent ||
                    "To bring spiritual transformation worldwide, empower believers, and serve communities through meaningful outreach programs and initiatives."}
                </Text>

                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient="radial(gray.200, transparent)"
                  opacity={0.3}
                  pointerEvents="none"
                />
              </Box>
            </MotionBox>

            {/* Our Vision */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Box
                bg={sectionBg}
                borderRadius="xl"
                p={6}
                h="full"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                }}
                transition="all 0.3s"
                borderWidth="1px"
                borderColor={dividerBorderColor}
              >
                <Flex
                  w="50px"
                  h="50px"
                  borderRadius="lg"
                  bg="gray.500"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <Icon as={FiEye} boxSize={6} color="white" />
                </Flex>

                <Heading
                  size="md"
                  mb={3}
                  color={textColor}
                  fontFamily={fontFamily}
                >
                  {content.visionTitle || "Our Vision"}
                </Heading>
                <Text color={subTextColor} fontSize="sm" lineHeight="tall">
                  {content.visionContent ||
                    "A world transformed by the Gospel, reflecting God's love, peace, and justice. Equipping believers to shine as lights in every community."}
                </Text>

                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient="radial(gray.200, transparent)"
                  opacity={0.3}
                  pointerEvents="none"
                />
              </Box>
            </MotionBox>

            {/* Core Values */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box
                bg={sectionBg}
                borderRadius="xl"
                p={6}
                h="full"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                }}
                transition="all 0.3s"
                borderWidth="1px"
                borderColor={dividerBorderColor}
              >
                <Flex
                  w="50px"
                  h="50px"
                  borderRadius="lg"
                  bg="gray.700"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <Icon as={FiHeart} boxSize={6} color="white" />
                </Flex>

                <Heading
                  size="md"
                  mb={3}
                  color={textColor}
                  fontFamily={fontFamily}
                >
                  {content.valuesTitle || "Core Values"}
                </Heading>
                <Text color={subTextColor} fontSize="sm" lineHeight="tall">
                  {content.valuesContent ||
                    "Faith, community, service, and evangelism. These values guide our ministry as we spread the message of salvation and serve the world."}
                </Text>

                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient="radial(gray.200, transparent)"
                  opacity={0.3}
                  pointerEvents="none"
                />
              </Box>
            </MotionBox>
          </SimpleGrid>

          {/* Footer */}
          <VStack spacing={3} pt={8}>
            <Divider borderColor={dividerBorderColor} />
            <Text color={subTextColor} fontSize="sm" fontFamily={fontFamily}>
              © {new Date().getFullYear()} Lift Jesus International Ministries.
              All Rights Reserved.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
