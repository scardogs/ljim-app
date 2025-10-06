import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Button,
  Image,
} from "@chakra-ui/react";

export default function Give() {
  const bg = useColorModeValue(
    "linear(to-b, white, gray.100)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );

  const [showQR, setShowQR] = useState(false);
  const [timer, setTimer] = useState(0); // start at 0 so button is enabled

  const handleGiveClick = () => {
    setShowQR(true);
    setTimer(60); // Reset timer
  };

  useEffect(() => {
    let interval;
    if (showQR && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowQR(false);
    }
    return () => clearInterval(interval);
  }, [showQR, timer]);

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      textAlign="center"
      py={{ base: 16, md: 24 }}
    >
      <VStack spacing={8} maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>Give</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Support our ministry through your generous contributions.
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            How to Give
          </Heading>
          <Text color={subTextColor} mb={4}>
            You can give online or in person during our services.
          </Text>

          <Button
            bg="white"
            color="black"
            border="2px solid black"
            _hover={{ bg: "black", color: "white" }}
            size="md"
            onClick={handleGiveClick}
            isDisabled={showQR && timer > 0} // disable while timer is running
          >
            {showQR && timer > 0 ? `Please wait (${timer}s)` : "Give Now"}
          </Button>

          {showQR && (
            <VStack mt={4}>
              <Image
                src="/images/qrcode.png"
                alt="QR Code"
                width={{ base: "250px", md: "300px" }}
                objectFit="contain"
                borderRadius="md"
                boxShadow="lg"
              />
              <Text fontFamily="monospace" color={subTextColor}>
                QR Code expires in {timer} second{timer !== 1 ? "s" : ""}
              </Text>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
