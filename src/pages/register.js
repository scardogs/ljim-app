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
  Link,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        toast({
          title: "Registration Successful",
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
          description: data.error || "Unable to create account",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
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
                Admin Registration
              </Heading>
              <Text color={subTextColor}>Create a new admin account</Text>

              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  This registration is for admin accounts only. Contact your
                  administrator if you need access.
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
                    bg={useColorModeValue("gray.900", "gray.100")}
                    color={useColorModeValue("white", "gray.900")}
                    _hover={{
                      bg: useColorModeValue("gray.800", "gray.200"),
                    }}
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Register
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
