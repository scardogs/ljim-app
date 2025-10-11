import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Flex,
  Link,
  Badge,
  Container,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { ExternalLinkIcon, StarIcon } from "@chakra-ui/icons";
import OptimizedImage from "../OptimizedImage";
import ChurchLoader from "../ChurchLoader";
import { useHomepageContent } from "../../contexts/HomepageContext";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Background gradient shift
const bgShift = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

// Pulse animation for featured badge
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

export default function ShowcaseSection() {
  const { content, loading, error } = useHomepageContent();

  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-b, white, gray.50)",
    "linear(to-b, black, gray.900)"
  );
  const cardBg = useColorModeValue("white", "rgba(0, 0, 0, 0.6)");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Show loading state
  if (loading) {
    return (
      <Flex w="100vw" minH="600px" justify="center" align="center">
        <ChurchLoader message="Loading showcase..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box w="100vw" py={20} textAlign="center">
        <Text color="red.500">Error loading content: {error}</Text>
      </Box>
    );
  }

  // Don't render if no content
  if (!content) {
    return null;
  }

  // Don't render if no showcase items - completely hide the section
  if (!content.showcaseItems || content.showcaseItems.length === 0) {
    return null;
  }

  const featuredItem = content.showcaseItems[0];
  const regularItems = content.showcaseItems.slice(1);

  return (
    <Box
      w="100vw"
      py={{ base: 16, md: 24 }}
      bgGradient={bgGradient}
      backgroundSize="400% 400%"
      animation={`${bgShift} 30s ease infinite`}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="gray.400"
        opacity={0.03}
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="gray.600"
        opacity={0.03}
        filter="blur(100px)"
      />

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <VStack spacing={3} textAlign="center" mb={12}>
          <Heading
            as="h2"
            size="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, gray.400, silver, black)"
            bgClip="text"
            animation={`${shimmer} 6s ease-in-out infinite`}
          >
            {content.showcaseTitle || "Highlights"}
          </Heading>
          <Text fontSize="lg" fontFamily="monospace" color={subText} maxW="3xl">
            {content.showcaseDescription ||
              "Celebrating moments that matter in our ministry."}
          </Text>
          <Divider
            w="100px"
            borderColor="gray.400"
            borderWidth="2px"
            borderRadius="full"
            opacity={0.6}
          />
        </VStack>

        {/* Featured Item - Large Hero Card */}
        {featuredItem && (
          <MotionBox
            mb={12}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MotionFlex
              direction={{ base: "column", lg: "row" }}
              bg={cardBg}
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
              borderWidth="2px"
              borderColor={borderColor}
              position="relative"
              _hover={{
                boxShadow: "0px 20px 60px rgba(0,0,0,0.3)",
              }}
              cursor={featuredItem.link ? "pointer" : "default"}
            >
              {/* Featured Badge */}
              <Badge
                position="absolute"
                top={6}
                left={6}
                colorScheme="gray"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                display="flex"
                alignItems="center"
                gap={1}
                zIndex={2}
                bg="rgba(0,0,0,0.7)"
                color="white"
                animation={`${pulse} 3s ease-in-out infinite`}
              >
                <StarIcon boxSize={3} />
                Featured
              </Badge>

              {/* Image Side */}
              {featuredItem.image && (
                <Box
                  w={{ base: "100%", lg: "55%" }}
                  h={{ base: "350px", lg: "500px" }}
                  position="relative"
                >
                  <OptimizedImage
                    src={featuredItem.image}
                    alt={featuredItem.title || "Featured showcase item"}
                    width={900}
                    height={500}
                    crop="fill"
                    gravity="auto"
                    quality="auto"
                    format="auto"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%) brightness(0.85)",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-r, transparent, rgba(0,0,0,0.2))"
                  />
                </Box>
              )}

              {/* Content Side */}
              <VStack
                align="stretch"
                justify="center"
                p={{ base: 8, lg: 12 }}
                spacing={6}
                flex={1}
              >
                <VStack align="stretch" spacing={4}>
                  <Heading
                    size="2xl"
                    color={textColor}
                    fontFamily="monospace"
                    letterSpacing="tight"
                  >
                    {featuredItem.title}
                  </Heading>

                  {featuredItem.description && (
                    <Text color={subText} fontSize="lg" lineHeight="tall">
                      {featuredItem.description}
                    </Text>
                  )}
                </VStack>

                {featuredItem.link && (
                  <Link
                    href={featuredItem.link}
                    isExternal
                    color="gray.700"
                    fontSize="md"
                    fontWeight="bold"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    mt={4}
                    p={4}
                    bg="gray.100"
                    borderRadius="lg"
                    w="fit-content"
                    _hover={{
                      bg: "gray.200",
                      transform: "translateX(5px)",
                    }}
                    transition="all 0.3s"
                  >
                    Explore More <ExternalLinkIcon />
                  </Link>
                )}
              </VStack>
            </MotionFlex>
          </MotionBox>
        )}

        {/* Regular Items - Staggered Grid Layout */}
        {regularItems.length > 0 && (
          <Box>
            {/* Desktop: Asymmetric Grid */}
            <Box display={{ base: "none", md: "block" }}>
              {regularItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <MotionFlex
                    key={index}
                    direction={isEven ? "row" : "row-reverse"}
                    mb={8}
                    gap={8}
                    align="center"
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {/* Image */}
                    {item.image && (
                      <MotionBox
                        w="45%"
                        h="280px"
                        borderRadius="2xl"
                        overflow="hidden"
                        boxShadow="xl"
                        _hover={{
                          transform: "scale(1.03)",
                          boxShadow: "2xl",
                        }}
                        transition="all 0.3s"
                      >
                        <OptimizedImage
                          src={item.image}
                          alt={item.title || "Showcase item"}
                          width={700}
                          height={280}
                          crop="fill"
                          gravity="auto"
                          quality="auto"
                          format="auto"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "grayscale(100%) brightness(0.85)",
                          }}
                        />
                      </MotionBox>
                    )}

                    {/* Content */}
                    <VStack
                      align={isEven ? "flex-start" : "flex-end"}
                      flex={1}
                      spacing={4}
                      textAlign={isEven ? "left" : "right"}
                    >
                      <Box w="60px" h="4px" bg="gray.400" borderRadius="full" />
                      <Heading
                        size="xl"
                        color={textColor}
                        fontFamily="monospace"
                      >
                        {item.title}
                      </Heading>

                      {item.description && (
                        <Text color={subText} fontSize="md" maxW="500px">
                          {item.description}
                        </Text>
                      )}

                      {item.link && (
                        <Link
                          href={item.link}
                          isExternal
                          color="gray.600"
                          fontSize="sm"
                          fontWeight="semibold"
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                          mt={2}
                          px={4}
                          py={2}
                          borderWidth="1px"
                          borderColor="gray.300"
                          borderRadius="full"
                          _hover={{
                            bg: "gray.100",
                            borderColor: "gray.400",
                          }}
                        >
                          Learn More <ExternalLinkIcon />
                        </Link>
                      )}
                    </VStack>
                  </MotionFlex>
                );
              })}
            </Box>

            {/* Mobile: Card Stack */}
            <SimpleGrid
              columns={1}
              spacing={6}
              display={{ base: "grid", md: "none" }}
            >
              {regularItems.map((item, index) => (
                <MotionBox
                  key={index}
                  bg={cardBg}
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "2xl",
                  }}
                  cursor={item.link ? "pointer" : "default"}
                >
                  {/* Image */}
                  {item.image && (
                    <Box h="200px" overflow="hidden">
                      <OptimizedImage
                        src={item.image}
                        alt={item.title || "Showcase item"}
                        width={600}
                        height={200}
                        crop="fill"
                        gravity="auto"
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
                  )}

                  {/* Content */}
                  <VStack align="stretch" p={6} spacing={3}>
                    <Heading size="md" color={textColor} fontFamily="monospace">
                      {item.title}
                    </Heading>

                    {item.description && (
                      <Text color={subText} fontSize="sm">
                        {item.description}
                      </Text>
                    )}

                    {item.link && (
                      <Link
                        href={item.link}
                        isExternal
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="semibold"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                        _hover={{ color: "gray.800" }}
                      >
                        Learn More <ExternalLinkIcon />
                      </Link>
                    )}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
