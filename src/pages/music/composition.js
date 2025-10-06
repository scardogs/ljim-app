import React from "react";
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <Box
      w="100vw"
      h="100vh"
      bg="black"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Navbar />
      <VStack spacing={6} textAlign="center">
        <Heading
          fontSize={{ base: "3xl", md: "5xl" }}
          color="white"
          fontFamily="monospace"
        >
          Coming Soon
        </Heading>
        <Text
          fontSize={{ base: "md", md: "xl" }}
          color="gray.400"
          fontFamily="monospace"
        >
          We're working hard to bring something amazing. Stay tuned!
        </Text>
        <Button
          colorScheme="gray"
          bg="gray.700"
          color="white"
          fontFamily="monospace"
          _hover={{ bg: "gray.500" }}
          onClick={() => router.push("/")}
        >
          Go Back Home
        </Button>
      </VStack>
    </Box>
  );
}
