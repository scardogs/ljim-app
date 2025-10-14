import React from "react";
import {
  Box,
  HStack,
  IconButton,
  Text,
  Button,
  VStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRouter } from "next/router";
import ChurchLoader from "../ChurchLoader";
import { useHomepageContent } from "../../contexts/HomepageContext";

export default function FooterSection() {
  const router = useRouter();
  const { content, loading, error } = useHomepageContent();
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");

  // Show loading state
  if (loading) {
    return (
      <Box textAlign="center" bg="black" w="100%" py={12} px={4}>
        <Flex justify="center" align="center" minH="200px">
          <ChurchLoader message="Loading..." />
        </Flex>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box textAlign="center" bg="black" w="100%" py={12} px={4}>
        <Flex justify="center" align="center" minH="200px">
          <Text color="red.500">Error loading content: {error}</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box textAlign="center" bg="black" w="100%" py={12} px={4}>
      <VStack spacing={8}>
        {/* Call to Action Button */}
        {content && (
          <Button
            size="lg"
            px={12}
            py={7}
            fontSize="lg"
            borderRadius="full"
            bgGradient="linear(to-r, gray.800, gray.600)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, gray.700, gray.500)",
              transform: "scale(1.05)",
              boxShadow: "lg",
            }}
            transition="all 0.3s ease"
            onClick={() => router.push("/contact")}
          >
            {content.ctaButtonText || "Learn More About Us"}
          </Button>
        )}

        {/* Social Media Icons */}
        <HStack spacing={6} justify="center" mb={4}>
          <IconButton
            as="a"
            href="https://facebook.com/LiftJesusInternational"
            target="_blank"
            aria-label="Facebook"
            icon={<FaFacebook />}
            variant="ghost"
            fontSize="2xl"
            color={"white"}
            _hover={{ color: "gray.500", transform: "scale(1.1)" }}
          />
          <IconButton
            as="a"
            href="mailto:contact@LJIM.org"
            aria-label="Email"
            icon={<FaEnvelope />}
            variant="ghost"
            fontSize="2xl"
            color={"white"}
            _hover={{ color: "gray.500", transform: "scale(1.1)" }}
          />
          <IconButton
            as="a"
            href="tel:+63XXXXXXX"
            aria-label="Phone"
            icon={<FaPhone />}
            variant="ghost"
            fontSize="2xl"
            color={"white"}
            _hover={{ color: "gray.500", transform: "scale(1.1)" }}
          />
        </HStack>
        {/* Copyright */}
        <Text color={"white"} fontSize="sm">
          © {new Date().getFullYear()} Lift Jesus InternationalMinistries. All
          rights reserved.
        </Text>
      </VStack>
    </Box>
  );
}
