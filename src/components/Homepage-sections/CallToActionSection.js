import React, { useState, useEffect } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function CallToActionSection() {
  const router = useRouter();
  const [content, setContent] = useState(null);

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching homepage content:", err));
  }, []);

  // Show loading state
  if (!content) {
    return (
      <Flex justify="center" w="full" mt={12}>
        <Text>Loading...</Text>
      </Flex>
    );
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
        onClick={() => router.push("/about")}
      >
        {content.ctaButtonText || "Learn More About Us"}
      </Button>
    </Flex>
  );
}
