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

export default function Contact() {
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
          <Heading color={textColor}>Contact Us</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            Reach out to us with questions, prayer requests, or feedback.
          </Text>
        </Box>

        {/* Contact Info */}
        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={2}>
            Get in Touch
          </Heading>
          <Text color={subTextColor} mb={4}>
            Email: johnmichael.escarlan14@gmail.com <br />
            Phone: +639 946760366
          </Text>

          {/* Contact Form */}
          <VStack spacing={4}>
            <Input
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBg}
              color={textColor}
            />
            <Textarea
              placeholder="Your Message"
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
