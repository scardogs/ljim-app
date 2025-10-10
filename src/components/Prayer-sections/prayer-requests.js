import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Card,
  CardBody,
  useToast,
  Switch,
  Badge,
  HStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import ChurchLoader from "../ChurchLoader";

export default function PrayerRequests() {
  const [content, setContent] = useState(null);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

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
  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("white", "gray.700");

  // Fetch content and prayer requests
  useEffect(() => {
    fetchContent();
    fetchPrayerRequests();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/prayer-requests/content");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchPrayerRequests = async () => {
    try {
      const response = await fetch("/api/prayer-requests");
      const data = await response.json();
      setPrayerRequests(data);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.request) {
      toast({
        title: "Required Fields",
        description: "Please provide your name and prayer request",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Prayer Request Submitted",
          description:
            content?.successMessage ||
            "Thank you! Your prayer request has been received.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFormData({
          name: "",
          email: "",
          request: "",
          isPublic: false,
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting prayer request:", error);
      toast({
        title: "Error",
        description: "Failed to submit prayer request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (requestId) => {
    try {
      const response = await fetch(`/api/prayer-requests/${requestId}/pray`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Thank You",
          description: "Your prayer has been recorded",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchPrayerRequests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error recording prayer:", error);
    }
  };

  if (!content) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient={bg}
      >
        <ChurchLoader message="Loading prayer requests..." />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bg} py={{ base: 16, md: 24 }}>
      <VStack spacing={8} maxW="6xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header Section */}
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%" textAlign="center">
          <Heading color={textColor}>
            {content.title || "Prayer Requests"}
          </Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            {content.subtitle || "Share your prayer needs with our community."}
          </Text>
          {content.description && (
            <Text color={subTextColor} mt={2}>
              {content.description}
            </Text>
          )}
        </Box>

        {/* Submit Prayer Request Form */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" w="100%">
          <CardBody p={{ base: 6, md: 8 }}>
            <Heading size="md" mb={6} color={textColor}>
              {content.formTitle || "Submit a Prayer Request"}
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Your Name</FormLabel>
                  <Input
                    bg={inputBg}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Email (Optional)</FormLabel>
                  <Input
                    bg={inputBg}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Prayer Request</FormLabel>
                  <Textarea
                    bg={inputBg}
                    value={formData.request}
                    onChange={(e) =>
                      setFormData({ ...formData, request: e.target.value })
                    }
                    placeholder="Share your prayer need..."
                    rows={6}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" color={textColor}>
                    Share publicly on prayer wall
                  </FormLabel>
                  <Switch
                    isChecked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  size="lg"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                >
                  {content.submitButtonText || "Submit Prayer Request"}
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Prayer Wall */}
        {prayerRequests.length > 0 && (
          <>
            <Box
              bg={sectionBg}
              p={6}
              borderRadius="xl"
              w="100%"
              textAlign="center"
            >
              <Heading size="lg" color={textColor}>
                {content.wallTitle || "Prayer Wall"}
              </Heading>
              <Text color={subTextColor} mt={2}>
                {content.wallDescription ||
                  "Join us in prayer for these requests from our community."}
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
              {prayerRequests.map((request) => (
                <Card
                  key={request._id}
                  bg={cardBg}
                  shadow="md"
                  borderRadius="lg"
                  _hover={{ boxShadow: "lg", transition: "all 0.3s" }}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color={textColor}>
                          {request.name}
                        </Text>
                        <Badge colorScheme="blue">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Badge>
                      </HStack>

                      <Text color={subTextColor}>{request.request}</Text>

                      <Divider />

                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiHeart} color="red.500" />
                          <Text fontSize="sm" color={subTextColor}>
                            {request.prayerCount}{" "}
                            {request.prayerCount === 1 ? "person" : "people"}{" "}
                            prayed
                          </Text>
                        </HStack>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          onClick={() => handlePray(request._id)}
                        >
                          {content.prayButtonText || "I Prayed"}
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Box>
  );
}
