import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Heading,
  VStack,
  Divider,
  Flex,
  Icon,
  Container,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import {
  FiUsers,
  FiHeart,
  FiBookOpen,
  FiGlobe,
  FiMusic,
  FiStar,
  FiTarget,
  FiAward,
} from "react-icons/fi";
import ChurchLoader from "../ChurchLoader";

const MotionBox = motion(Box);

// Icon mapping for ministries
const iconMap = {
  worship: FiMusic,
  outreach: FiGlobe,
  teaching: FiBookOpen,
  youth: FiUsers,
  prayer: FiHeart,
  missions: FiTarget,
  discipleship: FiStar,
  default: FiAward,
};

// Shimmer for text
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Pulse animation for icons
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Float animation
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Subtle background gradient animation
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

export default function MinistriesSection() {
  const [content, setContent] = React.useState(null);

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue("rgba(255,255,255,0.9)", "rgba(0,0,0,0.5)");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const verseColor = useColorModeValue("gray.700", "gray.300");
  const bgGradient = useColorModeValue(
    "linear(to-b, gray.50, white)",
    "linear(to-b, gray.900, black)"
  );
  const iconBg = useColorModeValue("gray.100", "gray.800");
  const iconColor = useColorModeValue("gray.700", "gray.300");
  const accentLine = useColorModeValue("gray.300", "gray.600");
  const cardHoverBg = useColorModeValue(
    "rgba(255,255,255,1)",
    "rgba(0,0,0,0.7)"
  );
  const floatingBlob1Bg = useColorModeValue(
    "rgba(160, 160, 160, 0.08)",
    "rgba(192, 192, 192, 0.04)"
  );
  const floatingBlob2Bg = useColorModeValue(
    "rgba(192, 192, 192, 0.06)",
    "rgba(160, 160, 160, 0.03)"
  );
  const cardHoverBorderColor = useColorModeValue("gray.400", "gray.500");

  // Fetch content from database
  React.useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Get ministries from content
  const ministries = content?.ministries || [];

  // Show loading state
  if (!content) {
    return (
      <Flex w="100vw" minH="500px" justify="center" align="center">
        <ChurchLoader message="Loading ministries..." />
      </Flex>
    );
  }

  // Helper to get icon for ministry
  const getMinistryIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || "";
    for (const [key, IconComponent] of Object.entries(iconMap)) {
      if (lowerTitle.includes(key)) {
        return IconComponent;
      }
    }
    return iconMap.default;
  };

  return (
    <Box
      w="100vw"
      py={{ base: 20, md: 28 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 25s ease infinite`}
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
        backgroundSize="50px 50px"
        backgroundImage="linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)"
        opacity={0.03}
        zIndex={0}
      />

      {/* Floating decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg={floatingBlob1Bg}
        filter="blur(60px)"
        animation={`${float} 8s ease-in-out infinite`}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="8%"
        w="250px"
        h="250px"
        borderRadius="full"
        bg={floatingBlob2Bg}
        filter="blur(50px)"
        animation={`${float} 10s ease-in-out infinite reverse`}
        zIndex={0}
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        {/* Header Section */}
        <VStack spacing={6} mb={16} textAlign="center">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={subText}
              textTransform="uppercase"
              letterSpacing="wider"
              mb={2}
            >
              What We Do
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, gray.400, silver, black)"
              bgClip="text"
              backgroundSize="200% auto"
              animation={`${shimmer} 6s ease-in-out infinite`}
              fontFamily="monospace"
            >
              Our Ministries
            </Heading>
          </Box>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={subText}
            maxW="3xl"
            lineHeight="tall"
            fontFamily="monospace"
          >
            Each ministry is a reflection of God&apos;s heart — reaching,
            teaching, and transforming lives through His Word and Spirit.
          </Text>

          <Divider
            w="100px"
            borderColor="gray.400"
            borderWidth="2px"
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>

        {/* Ministries Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 6, md: 8 }}
          mb={20}
        >
          {ministries.map((m, index) => {
            const MinistryIcon = getMinistryIcon(m.title);

            return (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  bg={glassBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  backdropFilter="blur(12px)"
                  borderRadius="2xl"
                  p={6}
                  h="full"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    bg: cardHoverBg,
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    borderColor: cardHoverBorderColor,
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  boxShadow="md"
                >
                  {/* Decorative top accent */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="3px"
                    bgGradient="linear(to-r, gray.400, silver, gray.400)"
                    opacity={0.6}
                  />

                  {/* Decorative corner accent */}
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    w="100px"
                    h="100px"
                    bgGradient="radial(gray.200, transparent)"
                    opacity={0.2}
                    pointerEvents="none"
                  />

                  <VStack spacing={4} align="center">
                    {/* Icon */}
                    <Flex
                      w="70px"
                      h="70px"
                      borderRadius="2xl"
                      bg={iconBg}
                      align="center"
                      justify="center"
                      position="relative"
                      borderWidth="2px"
                      borderColor={borderColor}
                      _groupHover={{
                        animation: `${pulse} 2s ease-in-out infinite`,
                      }}
                    >
                      <Icon as={MinistryIcon} boxSize={8} color={iconColor} />

                      {/* Icon glow effect */}
                      <Box
                        position="absolute"
                        w="100%"
                        h="100%"
                        borderRadius="2xl"
                        bg={iconBg}
                        filter="blur(10px)"
                        opacity={0.3}
                        zIndex={-1}
                      />
                    </Flex>

                    {/* Number badge */}
                    <Box
                      position="absolute"
                      top={4}
                      left={4}
                      w="28px"
                      h="28px"
                      borderRadius="full"
                      bg={iconBg}
                      borderWidth="2px"
                      borderColor={borderColor}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xs" fontWeight="bold" color={iconColor}>
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                    </Box>

                    {/* Title */}
                    <Heading
                      size="md"
                      color={textColor}
                      fontFamily="monospace"
                      textAlign="center"
                      letterSpacing="tight"
                    >
                      {m.title}
                    </Heading>

                    {/* Divider */}
                    <Box w="40px" h="2px" bg={accentLine} borderRadius="full" />

                    {/* Description */}
                    <Text
                      fontSize="sm"
                      color={subText}
                      lineHeight="tall"
                      textAlign="center"
                      fontFamily="monospace"
                    >
                      {m.description}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            );
          })}
        </SimpleGrid>

        {/* Bible Verse Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            bg={glassBg}
            backdropFilter="blur(12px)"
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="xl"
            maxW="4xl"
            mx="auto"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative quote marks */}
            <Box
              position="absolute"
              top={4}
              left={4}
              fontSize="6xl"
              color={accentLine}
              opacity={0.2}
              fontFamily="Georgia, serif"
              lineHeight="1"
            >
              &ldquo;
            </Box>
            <Box
              position="absolute"
              bottom={4}
              right={4}
              fontSize="6xl"
              color={accentLine}
              opacity={0.2}
              fontFamily="Georgia, serif"
              lineHeight="1"
            >
              &rdquo;
            </Box>

            <VStack spacing={4} position="relative">
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontStyle="italic"
                fontFamily="monospace"
                color={verseColor}
                textAlign="center"
                lineHeight="tall"
                px={{ base: 4, md: 8 }}
              >
                Each of you should use whatever gift you have received to serve
                others, as faithful stewards of God&apos;s grace in its various
                forms.
              </Text>

              <Divider
                w="60px"
                borderColor={accentLine}
                borderWidth="2px"
                borderRadius="full"
                opacity={0.4}
              />

              <Text
                fontWeight="bold"
                color={verseColor}
                fontSize="md"
                fontFamily="monospace"
                letterSpacing="wide"
              >
                — 1 Peter 4:10 (NIV)
              </Text>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
