import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ChurchLoader from "../ChurchLoader";

export default function Contact() {
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
  const inputBg = useColorModeValue("gray.200", "gray.700");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  // Fetch content from database
  React.useEffect(() => {
    fetch("/api/admin/contact")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching contact content:", err));
  }, []);

  const handleSend = () => {
    if (!email || !message) {
      toast({
        title: "Error",
        description: "Please enter both email and message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate email sending (replace with actual API or EmailJS)
    toast({
      title: "Message Sent",
      description: `Thank you for reaching out, ${email}!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setEmail("");
    setMessage("");
  };

  // Show loading state
  if (!content) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient={bg}
      >
        <ChurchLoader message="Loading contact information..." />
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <VStack spacing={8} maxW="4xl" mx="auto">
        {/* Contact Heading */}
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>{content.title || "Contact Us"}</Heading>
          <Text
            fontFamily="monospace"
            color={subTextColor}
            mt={4}
            fontSize="lg"
          >
            {content.subtitle ||
              "Reach out to us with questions, prayer requests, or feedback."}
          </Text>
        </Box>

        {/* Contact Info */}
        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            {content.contactInfoTitle || "Get in Touch"}
          </Heading>
          <Text fontFamily="monospace" color={subTextColor} mb={4}>
            {content.email && (
              <>
                Email: {content.email}
                <br />
              </>
            )}
            {content.phone && (
              <>
                Phone: {content.phone}
                <br />
              </>
            )}
            {content.address && (
              <>
                Address: {content.address}
                <br />
              </>
            )}
            {content.officeHours && <>Office Hours: {content.officeHours}</>}
          </Text>

          {/* Contact Form */}
          <VStack spacing={4}>
            <Input
              placeholder="Your Email"
              fontFamily="monospace"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBg}
              color={textColor}
            />
            <Textarea
              placeholder="Your Message"
              fontFamily="monospace"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              bg={inputBg}
              color={textColor}
              rows={5}
            />
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
              onClick={handleSend}
              w="full"
            >
              Send Message
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
