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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FiDollarSign, FiCreditCard } from "react-icons/fi";
import ImprovedImageUpload from "./ImprovedImageUpload";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function GiveContentEditor() {
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
      const response = await fetch("/api/admin/give");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load give content",
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
      const response = await fetch("/api/admin/give", {
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
          description: "Give page content updated successfully",
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
        description: "Failed to save give content",
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
          <Heading size={{ base: "md", md: "lg" }}>Give Page Content</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Manage donation page content and payment options
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
            <SectionHeader icon={FiDollarSign} title="Main Section" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Page Title</FormLabel>
                <DebouncedInput
                  value={content.title || ""}
                  onChange={(value) => updateField("title", value)}
                  size="lg"
                  placeholder="Give"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Subtitle</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Brief description encouraging giving
                </Text>
                <DebouncedTextarea
                  value={content.subtitle || ""}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={3}
                  placeholder="Support our ministry through your generous contributions."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* How to Give Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiCreditCard} title="How to Give Section" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Section Title</FormLabel>
                <DebouncedInput
                  value={content.howToGiveTitle || ""}
                  onChange={(value) => updateField("howToGiveTitle", value)}
                  size="lg"
                  placeholder="How to Give"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Description</FormLabel>
                <DebouncedTextarea
                  value={content.howToGiveDescription || ""}
                  onChange={(value) =>
                    updateField("howToGiveDescription", value)
                  }
                  rows={3}
                  placeholder="You can give online or in person during our services."
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Button Text</FormLabel>
                <DebouncedInput
                  value={content.buttonText || ""}
                  onChange={(value) => updateField("buttonText", value)}
                  placeholder="Give Now"
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* QR Code Settings */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiCreditCard} title="QR Code Settings" />
            <VStack spacing={6} align="stretch">
              <ImprovedImageUpload
                label="QR Code Image"
                value={content.qrCodeImage || ""}
                onChange={(value) => updateField("qrCodeImage", value)}
                placeholder="/images/qrcode.png"
                imageType="give/qrcode"
              />

              <FormControl>
                <FormLabel fontWeight="semibold">
                  QR Code Display Timeout (seconds)
                </FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  How long the QR code stays visible after clicking the button
                </Text>
                <NumberInput
                  value={content.qrCodeTimeout || 60}
                  onChange={(valueString) =>
                    updateField("qrCodeTimeout", parseInt(valueString) || 60)
                  }
                  min={10}
                  max={300}
                  size="lg"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Additional Payment Information */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader
              icon={FiDollarSign}
              title="Additional Payment Information"
            />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">
                  Bank Details (Optional)
                </FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Bank account information for direct transfers
                </Text>
                <DebouncedTextarea
                  value={content.bankDetails || ""}
                  onChange={(value) => updateField("bankDetails", value)}
                  rows={4}
                  placeholder="Bank Name: ABC Bank&#10;Account Name: LJIM&#10;Account Number: 123456789"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">
                  Other Payment Methods (Optional)
                </FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  List other ways people can donate (PayPal, Venmo, etc.)
                </Text>
                <DebouncedTextarea
                  value={content.otherPaymentMethods || ""}
                  onChange={(value) =>
                    updateField("otherPaymentMethods", value)
                  }
                  rows={4}
                  placeholder="PayPal: donations@ljim.com&#10;Venmo: @LJIM"
                />
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
