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
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={4}
      position="relative"
    >
      {/* Navbar at the top */}
      <Box position="absolute" top={0} left={0} right={0}>
        <Navbar />
      </Box>

      <VStack spacing={8} textAlign="center" zIndex={1}>
        {/* Heading */}
        <Heading
          fontSize={{ base: "3xl", md: "5xl" }}
          color="white"
          fontFamily="monospace"
          textTransform="uppercase"
        >
          Coming Soon
        </Heading>

        {/* Subtext */}
        <Text
          fontSize={{ base: "md", md: "xl" }}
          color="gray.400"
          fontFamily="monospace"
          maxW="lg"
        >
          We&apos;re working hard to bring something amazing. Stay tuned!
        </Text>

        {/* Button */}
        <Button
          bg="gray.700"
          color="white"
          fontFamily="monospace"
          _hover={{ bg: "gray.500" }}
          border="1px solid gray"
          onClick={() => router.push("/")}
        >
          Go Back Home
        </Button>
      </VStack>

      {/* Decorative lines in background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundSize="40px 40px"
        backgroundImage="
          linear-gradient(to right, gray 1px, transparent 1px),
          linear-gradient(to bottom, gray 1px, transparent 1px)"
        opacity={0.2}
        zIndex={0}
      />
    </Box>
  );
}
