import React from "react";
import Navbar from "../components/navbar";
import { Box, Heading, Text, Center } from "@chakra-ui/react";

export default function ComingSoonPage() {
  return (
    <>
      <Navbar />
      <Center minH="80vh">
        <Box
          textAlign="center"
          p={8}
          bg="gray.800"
          borderRadius="lg"
          boxShadow="lg"
        >
          <Heading size="2xl" color="teal.300" mb={4}>
            🚧 Coming Soon
          </Heading>
          <Text color="gray.300" fontSize="xl">
            This feature is under construction. Stay tuned!
          </Text>
        </Box>
      </Center>
    </>
  );
}
