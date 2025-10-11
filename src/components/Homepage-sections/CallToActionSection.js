import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ChurchLoader from "../ChurchLoader";
import { useHomepageContent } from "../../contexts/HomepageContext";

export default function CallToActionSection() {
  const router = useRouter();
  const { content, loading, error } = useHomepageContent();

  // Show loading state
  if (loading) {
    return (
      <Flex justify="center" w="full" mt={12} minH="200px" align="center">
        <ChurchLoader message="Loading..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Flex justify="center" w="full" mt={12} minH="200px" align="center">
        <Text color="red.500">Error loading content: {error}</Text>
      </Flex>
    );
  }

  // Don't render if no content
  if (!content) {
    return null;
  }

  return (
    <Flex justify="center" w="full" mt={12}>
      <Button
        size="lg"
        px={12}
        py={7}
        fontSize="lg"
        borderRadius="full"
        bgGradient="linear(to-r, gray.800, black)"
        color="white"
        _hover={{
          bgGradient: "linear(to-r, gray.700, gray.900)",
          transform: "scale(1.05)",
          boxShadow: "lg",
        }}
        transition="all 0.3s ease"
        onClick={() => router.push("/contact")}
      >
        {content.ctaButtonText || "Learn More About Us"}
      </Button>
    </Flex>
  );
}
