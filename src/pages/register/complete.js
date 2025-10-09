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
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";

export default function CompleteRegistration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const toast = useToast();

  // All color mode values must be at the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const readonlyBg = useColorModeValue("gray.100", "gray.700");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  const verifyToken = async (urlToken) => {
    try {
      const response = await fetch(
        `/api/auth/complete-registration?token=${urlToken}`
      );
      const data = await response.json();

      if (response.ok && data.valid) {
        setIsValidToken(true);
        setName(data.name);
        setEmail(data.email);
      } else {
        toast({
          title: "Invalid Link",
          description:
            data.error || "This approval link is invalid or has expired",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
        setTimeout(() => {
          router.push("/register");
        }, 3000);
      }
    } catch (error) {
      console.error("Token verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify approval link",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Check if already logged in
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      router.push("/admin");
      return;
    }

    // Get token from URL
    const { token: urlToken } = router.query;
    if (!urlToken) {
      setIsVerifying(false);
      return;
    }

    setToken(urlToken);
    verifyToken(urlToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        toast({
          title: "Registration Complete!",
          description: `Welcome, ${data.user.name}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Unable to complete registration",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Complete registration error:", error);
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

  if (isVerifying) {
    return (
      <>
        <Navbar />
        <Center minH="100vh" bg={bgColor}>
          <VStack spacing={4}>
            <Spinner size="xl" color="gray.600" />
            <Text color={textColor}>Verifying approval link...</Text>
          </VStack>
        </Center>
      </>
    );
  }

  if (!isValidToken) {
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
                  Invalid Link
                </Heading>
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    This approval link is invalid or has expired. Please contact
                    an administrator.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => router.push("/register")}
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{
                    bg: buttonHoverBg,
                  }}
                  size="lg"
                  width="full"
                >
                  Submit New Request
                </Button>
              </VStack>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

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
                Complete Registration
              </Heading>
              <Text color={subTextColor}>
                Your request has been approved! Set your password to complete
                registration.
              </Text>

              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Your registration request has been approved. Please create a
                  password to complete your account setup.
                </AlertDescription>
              </Alert>

              <form
                onSubmit={handleCompleteRegistration}
                style={{ width: "100%" }}
              >
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel color={textColor}>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      isReadOnly
                      size="lg"
                      bg={readonlyBg}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      isReadOnly
                      size="lg"
                      bg={readonlyBg}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      size="lg"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg={buttonBg}
                    color={buttonColor}
                    _hover={{
                      bg: buttonHoverBg,
                    }}
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Completing registration..."
                  >
                    Complete Registration
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
