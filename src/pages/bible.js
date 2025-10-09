/**
 * Bible Page
 * Full-featured Bible reading and search page with monochrome design
 */

import React from "react";
import Navbar from "../components/navbar";
import VerseOfTheDay from "../components/Bible-sections/VerseOfTheDay";
import BibleSearch from "../components/Bible-sections/BibleSearch";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FaBook, FaPray, FaHeart, FaSearch } from "react-icons/fa";

const BiblePage = () => {
  // Monochrome color values
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
    "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
  );
  const heroTextColor = useColorModeValue("gray.800", "gray.100");
  const heroSubtextColor = useColorModeValue("gray.600", "gray.400");
  const featuresBg = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(45, 45, 45, 0.8)"
  );
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.700", "gray.300");
  const ctaBg = useColorModeValue(
    "linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%)",
    "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
  );
  const accentColor = useColorModeValue("#A0A0A0", "#C0C0C0");

  const features = [
    {
      icon: FaBook,
      title: "Daily Verse",
      description:
        "Start your day with an inspirational verse selected just for you",
    },
    {
      icon: FaSearch,
      title: "Verse Search",
      description:
        "Find any Bible verse or passage instantly with our powerful search",
    },
    {
      icon: FaPray,
      title: "Multiple Translations",
      description:
        "Read the Bible in various translations to deepen your understanding",
    },
    {
      icon: FaHeart,
      title: "Share & Save",
      description: "Copy, share, or save your favorite verses with one click",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section with Glass-morphism */}
      <Box
        bgGradient={heroBg}
        pt={28}
        pb={16}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width="300px"
          height="300px"
          borderRadius="full"
          bg={useColorModeValue(
            "rgba(160, 160, 160, 0.1)",
            "rgba(192, 192, 192, 0.05)"
          )}
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-100px"
          left="-100px"
          width="400px"
          height="400px"
          borderRadius="full"
          bg={useColorModeValue(
            "rgba(192, 192, 192, 0.08)",
            "rgba(160, 160, 160, 0.03)"
          )}
          filter="blur(100px)"
        />

        <Container maxW="container.lg" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <Box
              display="inline-block"
              px={4}
              py={2}
              borderRadius="full"
              bg={useColorModeValue(
                "rgba(255, 255, 255, 0.6)",
                "rgba(255, 255, 255, 0.1)"
              )}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={useColorModeValue(
                "rgba(160, 160, 160, 0.3)",
                "rgba(192, 192, 192, 0.2)"
              )}
            >
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={accentColor}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Sacred Scripture
              </Text>
            </Box>

            <Heading
              size="3xl"
              color={heroTextColor}
              fontWeight="bold"
              letterSpacing="tight"
              lineHeight="1.2"
            >
              The Holy Bible
            </Heading>

            <Divider
              width="80px"
              borderColor={accentColor}
              borderWidth="2px"
              opacity={0.6}
            />

            <Text
              fontSize="xl"
              color={heroSubtextColor}
              maxW="650px"
              lineHeight="1.8"
              fontWeight="medium"
            >
              Explore God&apos;s Word, find inspiration, and strengthen your
              faith through Scripture
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Verse of the Day */}
      <VerseOfTheDay showTitle={true} compact={false} />

      {/* Bible Search */}
      <BibleSearch />

      {/* Features Section with Glass Cards */}
      <Box py={20} bg={featuresBg}>
        <Container maxW="container.lg">
          <VStack spacing={12}>
            <VStack spacing={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={accentColor}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Features
              </Text>
              <Heading
                size="xl"
                textAlign="center"
                color={heroTextColor}
                fontWeight="bold"
              >
                Everything You Need to Study Scripture
              </Heading>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w="100%"
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={cardBorder}
                  shadow="sm"
                  _hover={{
                    shadow: "xl",
                    transform: "translateY(-8px)",
                    borderColor: accentColor,
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                >
                  <CardBody>
                    <VStack spacing={4} textAlign="center" py={2}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg={iconBg}
                        border="2px solid"
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                        transition="all 0.3s"
                        _groupHover={{
                          borderColor: accentColor,
                          transform: "scale(1.1)",
                        }}
                      >
                        <Icon as={feature.icon} boxSize={7} color={iconColor} />
                      </Box>
                      <Heading
                        size="md"
                        color={heroTextColor}
                        fontWeight="bold"
                      >
                        {feature.title}
                      </Heading>
                      <Text
                        fontSize="sm"
                        color={heroSubtextColor}
                        lineHeight="1.7"
                      >
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action with Dark Gradient */}
      <Box
        py={20}
        bgGradient={ctaBg}
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Background Pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.05}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="30px 30px"
        />

        <Container maxW="container.md" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <Box w="60px" h="4px" bg={accentColor} borderRadius="full" mb={2} />
            <Heading
              size="xl"
              fontWeight="bold"
              lineHeight="1.6"
              letterSpacing="tight"
            >
              &ldquo;Thy word is a lamp unto my feet, and a light unto my
              path.&rdquo;
            </Heading>
            <Text
              fontSize="lg"
              opacity={0.8}
              fontWeight="medium"
              letterSpacing="wide"
            >
              — Psalm 119:105 (KJV)
            </Text>
            <Box w="60px" h="4px" bg={accentColor} borderRadius="full" mt={2} />
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default BiblePage;
