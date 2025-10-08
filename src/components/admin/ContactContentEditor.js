import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Card,
  CardBody,
  Spinner,
  Center,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function ContactContentEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  const fetchContent = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/contact");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load contact content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contact page content updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save contact content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="gray.600" thickness="4px" />
          <Text color="gray.500">Loading content...</Text>
        </VStack>
      </Center>
    );
  }

  if (!content) {
    return (
      <Box p={6}>
        <Text>No content available</Text>
      </Box>
    );
  }

  const SectionHeader = ({ icon, title }) => (
    <Flex align="center" gap={3} mb={4}>
      <Icon as={icon} boxSize={6} color="gray.600" />
      <Heading size="md">{title}</Heading>
    </Flex>
  );

  return (
    <Box maxW="1400px" mx="auto" pb={{ base: 20, md: 6 }}>
      {/* Header with Save Button */}
      <Flex
        position="sticky"
        top={0}
        bg={headerBg}
        zIndex={10}
        p={{ base: 4, md: 6 }}
        borderBottom="1px"
        borderColor={borderColor}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
        mb={{ base: 4, md: 6 }}
      >
        <VStack align="start" spacing={1}>
          <Heading size={{ base: "md", md: "lg" }}>
            Contact Page Content
          </Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Manage contact information and social media links
          </Text>
        </VStack>
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          onClick={handleSave}
          isLoading={isSaving}
          loadingText="Saving..."
          size={{ base: "md", md: "lg" }}
          w={{ base: "full", md: "auto" }}
          leftIcon={<Icon as={StarIcon} />}
        >
          Save Changes
        </Button>
      </Flex>

      <VStack spacing={{ base: 4, md: 6 }} px={{ base: 2, md: 6 }}>
        {/* Main Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiMail} title="Main Section" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Page Title</FormLabel>
                <DebouncedInput
                  value={content.title || ""}
                  onChange={(value) => updateField("title", value)}
                  size="lg"
                  placeholder="Contact Us"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Subtitle</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Brief description inviting people to reach out
                </Text>
                <DebouncedTextarea
                  value={content.subtitle || ""}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={3}
                  placeholder="Reach out to us with questions, prayer requests, or feedback."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiPhone} title="Contact Information" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Section Title</FormLabel>
                <DebouncedInput
                  value={content.contactInfoTitle || ""}
                  onChange={(value) => updateField("contactInfoTitle", value)}
                  size="lg"
                  placeholder="Get in Touch"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Email</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <Icon as={FiMail} />
                    </InputLeftAddon>
                    <DebouncedInput
                      type="email"
                      value={content.email || ""}
                      onChange={(value) => updateField("email", value)}
                      placeholder="contact@ljim.com"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Phone</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <Icon as={FiPhone} />
                    </InputLeftAddon>
                    <DebouncedInput
                      type="tel"
                      value={content.phone || ""}
                      onChange={(value) => updateField("phone", value)}
                      placeholder="+1 234 567 8900"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontWeight="semibold">Address (Optional)</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiMapPin} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.address || ""}
                    onChange={(value) => updateField("address", value)}
                    placeholder="123 Faith Street, City, State 12345"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">
                  Office Hours (Optional)
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiClock} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.officeHours || ""}
                    onChange={(value) => updateField("officeHours", value)}
                    placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                  />
                </InputGroup>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Social Media */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiFacebook} title="Social Media Links" />
            <Text fontSize="sm" color="gray.500" mb={6}>
              Add your social media profile URLs (leave empty to hide)
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel fontWeight="semibold">Facebook</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiFacebook} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.facebook || ""}
                    onChange={(value) => updateField("facebook", value)}
                    placeholder="https://facebook.com/ljim"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Instagram</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiInstagram} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.instagram || ""}
                    onChange={(value) => updateField("instagram", value)}
                    placeholder="https://instagram.com/ljim"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Twitter</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiTwitter} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.twitter || ""}
                    onChange={(value) => updateField("twitter", value)}
                    placeholder="https://twitter.com/ljim"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">YouTube</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Icon as={FiYoutube} />
                  </InputLeftAddon>
                  <DebouncedInput
                    value={content.youtube || ""}
                    onChange={(value) => updateField("youtube", value)}
                    placeholder="https://youtube.com/@ljim"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>

      {/* Floating Save Button (Mobile) */}
      <Box
        position="fixed"
        bottom={6}
        right={6}
        zIndex={20}
        display={{ base: "block", md: "none" }}
      >
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
          shadow="2xl"
          leftIcon={<Icon as={StarIcon} />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
