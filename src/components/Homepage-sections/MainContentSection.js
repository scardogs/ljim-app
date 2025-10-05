import React from "react";
import {
  Box,
  Heading,
  Text,
  Fade,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Define shimmering animation (left → right)
const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
`;

export default function IntroSection() {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      w="100%"
      h="100vh"
      bg="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="100%"
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bgGradient={useColorModeValue(
          "linear(to-b, white, gray.100)",
          "linear(to-b, gray.900, black)"
        )}
        px={6}
      >
        <Fade in>
          <VStack spacing={6} maxW="3xl">
            <Heading
              as="h2"
              size="2xl"
              fontWeight="extrabold"
              color={textColor}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Lift Jesus{" "}
              <Box
                as="span"
                bgGradient="linear(to-r, gray.400, gray.700, black, gray.400)"
                bgSize="200% auto"
                bgClip="text"
                color="transparent"
                animation={`${shimmer} 3s linear infinite`}
              >
                International Ministries
              </Box>
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={subText}
              lineHeight="1.9"
              fontFamily="monospace"
            >
              A fellowship of believers devoted to exalting Jesus Christ,
              preaching His Word, and transforming lives through worship,
              discipleship, and service. Together, we lift His name higher in
              every nation.
            </Text>
          </VStack>
        </Fade>
      </Box>
    </Box>
  );
}
