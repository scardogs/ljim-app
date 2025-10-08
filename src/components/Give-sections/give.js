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
  const [content, setContent] = useState(null);

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
  const [timer, setTimer] = useState(0);

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/give")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching give content:", err));
  }, []);

  const handleGiveClick = () => {
    setShowQR(true);
    setTimer(content?.qrCodeTimeout || 60);
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

  // Show loading state
  if (!content) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      textAlign="center"
      py={{ base: 16, md: 24 }}
    >
      <VStack spacing={8} maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>{content.title || "Give"}</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            {content.subtitle ||
              "Support our ministry through your generous contributions."}
          </Text>
        </Box>

        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            {content.howToGiveTitle || "How to Give"}
          </Heading>
          <Text color={subTextColor} mb={4}>
            {content.howToGiveDescription ||
              "You can give online or in person during our services."}
          </Text>

          <Button
            bg="white"
            color="black"
            border="2px solid black"
            _hover={{ bg: "black", color: "white" }}
            size="md"
            onClick={handleGiveClick}
            isDisabled={showQR && timer > 0}
          >
            {showQR && timer > 0
              ? `Please wait (${timer}s)`
              : content.buttonText || "Give Now"}
          </Button>

          {showQR && (
            <VStack mt={4}>
              <Image
                src={content.qrCodeImage || "/images/qrcode.png"}
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

        {/* Additional Payment Info */}
        {(content.bankDetails || content.otherPaymentMethods) && (
          <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
            {content.bankDetails && (
              <Box mb={4}>
                <Heading size="sm" color={textColor} mb={2}>
                  Bank Transfer
                </Heading>
                <Text
                  color={subTextColor}
                  fontFamily="monospace"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                >
                  {content.bankDetails}
                </Text>
              </Box>
            )}

            {content.otherPaymentMethods && (
              <Box>
                <Heading size="sm" color={textColor} mb={2}>
                  Other Payment Methods
                </Heading>
                <Text
                  color={subTextColor}
                  fontFamily="monospace"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                >
                  {content.otherPaymentMethods}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
}
