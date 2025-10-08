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
  Flex,
  Icon,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  HStack,
  Image,
  Divider,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FiLayout } from "react-icons/fi";
import ImageUpload from "./ImageUpload";
import DebouncedInput from "./DebouncedInput";

export default function NavbarEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");
  const previewBg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchContent = React.useCallback(async () => {
    try {
      const response = await fetch("/api/navbar/content");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load navbar content",
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
      const response = await fetch("/api/navbar/content", {
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
          description: "Navbar settings updated successfully",
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
        description: "Failed to save navbar settings",
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
          <Heading size={{ base: "md", md: "lg" }}>Navbar Settings</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Customize your navigation bar logo and branding
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
        {/* Preview Section */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" w="full">
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiLayout} title="Live Preview" />
            <Box
              bg={previewBg}
              p={6}
              borderRadius="lg"
              border="2px dashed"
              borderColor={borderColor}
            >
              <Flex align="center" gap={3}>
                {content.showLogo && content.logo && (
                  <Image
                    src={content.logo}
                    alt="Logo"
                    width={`${content.logoWidth}px`}
                    objectFit="contain"
                  />
                )}
                <Text
                  fontSize={content.fontSize || "2xl"}
                  fontWeight="bold"
                  color={textColor}
                  letterSpacing="wide"
                >
                  {content.brandText || "LJIM"}
                </Text>
              </Flex>
            </Box>
          </CardBody>
        </Card>

        {/* Logo Settings */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" w="full">
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiLayout} title="Logo Settings" />
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontWeight="semibold">
                  Show Logo
                </FormLabel>
                <Switch
                  isChecked={content.showLogo || false}
                  onChange={(e) => updateField("showLogo", e.target.checked)}
                  size="lg"
                />
              </FormControl>

              {content.showLogo && (
                <>
                  <Divider />

                  <ImageUpload
                    label="Logo Image"
                    value={content.logo || ""}
                    onChange={(value) => updateField("logo", value)}
                    placeholder="/images/logo.png"
                  />

                  <FormControl>
                    <FormLabel fontWeight="semibold">Logo Width (px)</FormLabel>
                    <Text fontSize="xs" color="gray.500" mb={2}>
                      Adjust the size of your logo
                    </Text>
                    <NumberInput
                      value={content.logoWidth || 40}
                      onChange={(valueString) =>
                        updateField("logoWidth", parseInt(valueString) || 40)
                      }
                      min={20}
                      max={150}
                      size="lg"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Brand Text Settings */}
        <Card bg={cardBg} shadow="lg" borderRadius="xl" w="full">
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiLayout} title="Brand Text Settings" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Brand Text</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  The text displayed in the navigation bar
                </Text>
                <DebouncedInput
                  value={content.brandText || ""}
                  onChange={(value) => updateField("brandText", value)}
                  size="lg"
                  placeholder="LJIM"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Font Size</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Choose the size of your brand text
                </Text>
                <Select
                  value={content.fontSize || "2xl"}
                  onChange={(e) => updateField("fontSize", e.target.value)}
                  size="lg"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                  <option value="2xl">2X Large</option>
                  <option value="3xl">3X Large</option>
                </Select>
              </FormControl>
            </VStack>
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
