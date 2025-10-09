import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Link,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/registration-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Submitted!",
          description:
            "Your registration request has been submitted. You will be notified when it is approved.",
          status: "success",
          duration: 8000,
          isClosable: true,
        });

        // Clear form
        setName("");
        setEmail("");
        setMessage("");

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast({
          title: "Request Failed",
          description: data.error || "Unable to submit registration request",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Registration request error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg={bgColor} pt="100px" pb="50px">
        <Container maxW="md">
          <Box
            bg={cardBg}
            p={8}
            borderRadius="xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <Heading size="xl" color={textColor}>
                Admin Access Request
              </Heading>
              <Text color={subTextColor}>Request admin account access</Text>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Submit a registration request. An existing admin will review
                  and approve your request.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleRegister} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ljim.com"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor}>Message (Optional)</FormLabel>
                    <Input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why do you need admin access?"
                      size="lg"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg={useColorModeValue("gray.900", "gray.100")}
                    color={useColorModeValue("white", "gray.900")}
                    _hover={{
                      bg: useColorModeValue("gray.800", "gray.200"),
                    }}
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Submitting request..."
                  >
                    Submit Request
                  </Button>
                </VStack>
              </form>

              <Text fontSize="sm" color={subTextColor}>
                Already have an account?{" "}
                <Link
                  color={textColor}
                  fontWeight="bold"
                  textDecoration="underline"
                  onClick={() => router.push("/login")}
                  _hover={{ color: useColorModeValue("gray.700", "gray.300") }}
                >
                  Login here
                </Link>
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
