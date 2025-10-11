import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Image,
  Button,
  Badge,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import ChurchLoader from "../ChurchLoader";

export default function Shop() {
  const [content, setContent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    quantity: 1,
    shippingAddress: "",
    additionalNotes: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const priceColor = useColorModeValue("blue.600", "blue.300");
  const modalBg = useColorModeValue("white", "gray.800");

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      quantity: 1,
      shippingAddress: "",
      additionalNotes: "",
    });
    onOpen();
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone
    ) {
      toast({
        title: "Required Fields",
        description: "Please provide your name, email, and phone number",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if Google Sheets URL is configured
      if (!content.googleSheetsUrl) {
        throw new Error("Google Sheets URL not configured");
      }

      // Prepare order data
      const orderData = {
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        quantity: formData.quantity,
        shippingAddress: formData.shippingAddress,
        additionalNotes: formData.additionalNotes,
      };

      // Submit to Google Sheets
      const response = await fetch(content.googleSheetsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Note: no-cors mode doesn't allow reading the response
      // We assume success if no error is thrown
      toast({
        title: "Order Submitted!",
        description:
          "Thank you for your order! We will contact you shortly to confirm your order details.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form and close modal
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        quantity: 1,
        shippingAddress: "",
        additionalNotes: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Submission Error",
        description:
          error.message === "Google Sheets URL not configured"
            ? "Order form is not configured yet. Please contact us directly."
            : "Failed to submit order. Please try contacting us directly via email or phone.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch content from database
  useEffect(() => {
    fetch("/api/admin/shop")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Error fetching shop content:", err));
  }, []);

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
        <ChurchLoader message="Loading shop..." />
      </Box>
    );
  }

  // Get unique categories
  const categories = [
    "All",
    ...new Set(content.products?.map((p) => p.category) || []),
  ];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? content.products
      : content.products?.filter((p) => p.category === selectedCategory);

  return (
    <Box minH="100vh" bgGradient={bg} py={{ base: 16, md: 24 }}>
      <VStack spacing={8} maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header Section */}
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%" textAlign="center">
          <Heading color={textColor}>{content.title || "Shop"}</Heading>
          <Text color={subTextColor} mt={4} fontSize="lg">
            {content.subtitle ||
              "Browse our collection of ministry resources and merchandise."}
          </Text>
        </Box>

        {/* Category Filter */}
        {categories.length > 1 && (
          <HStack spacing={4} flexWrap="wrap" justifyContent="center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "solid" : "outline"}
                bg={selectedCategory === category ? "black" : "transparent"}
                color={selectedCategory === category ? "white" : textColor}
                borderColor="black"
                _hover={{
                  bg: selectedCategory === category ? "gray.800" : "gray.100",
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </HStack>
        )}

        {/* Products Grid */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
            spacing={8}
            w="100%"
          >
            {filteredProducts.map((product, index) => (
              <Card
                key={index}
                bg={cardBg}
                boxShadow="lg"
                borderRadius="lg"
                overflow="hidden"
                _hover={{
                  boxShadow: "xl",
                  transition: "all 0.3s",
                }}
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    h="200px"
                    w="100%"
                    objectFit="cover"
                  />
                )}
                <CardBody>
                  <Stack spacing={3}>
                    <HStack justify="space-between">
                      <Heading size="md" color={textColor}>
                        {product.name}
                      </Heading>
                      {!product.inStock && (
                        <Badge colorScheme="red">Out of Stock</Badge>
                      )}
                    </HStack>
                    {product.description && (
                      <Text color={subTextColor} fontSize="sm">
                        {product.description}
                      </Text>
                    )}
                    <Text fontSize="2xl" fontWeight="bold" color={priceColor}>
                      ₱{product.price.toFixed(2)}
                    </Text>
                    {product.category && (
                      <Badge colorScheme="blue" w="fit-content">
                        {product.category}
                      </Badge>
                    )}
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing={2} w="100%">
                    <Button
                      flex={1}
                      bg="black"
                      color="white"
                      _hover={{ bg: "gray.800" }}
                      isDisabled={!product.inStock}
                      onClick={() => handleOrderClick(product)}
                    >
                      {product.inStock ? "Order Now" : "Unavailable"}
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Box
            bg={sectionBg}
            p={8}
            borderRadius="xl"
            w="100%"
            textAlign="center"
          >
            <Text color={subTextColor}>
              No products available at the moment.
            </Text>
          </Box>
        )}

        {/* Order Instructions */}
        {content.orderInstructions && (
          <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
            <Heading size="md" color={textColor} mb={4}>
              How to Order
            </Heading>
            <Text color={subTextColor} whiteSpace="pre-wrap">
              {content.orderInstructions}
            </Text>

            {(content.contactEmail || content.contactPhone) && (
              <VStack align="start" mt={4} spacing={2}>
                {content.contactEmail && (
                  <Text color={subTextColor}>
                    <strong>Email:</strong> {content.contactEmail}
                  </Text>
                )}
                {content.contactPhone && (
                  <Text color={subTextColor}>
                    <strong>Phone:</strong> {content.contactPhone}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
        )}

        {/* Payment & Shipping Info */}
        {(content.paymentMethods || content.shippingInfo) && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
            {content.paymentMethods && (
              <Box bg={sectionBg} p={6} borderRadius="xl">
                <Heading size="sm" color={textColor} mb={2}>
                  Payment Methods
                </Heading>
                <Text color={subTextColor} fontSize="sm" whiteSpace="pre-wrap">
                  {content.paymentMethods}
                </Text>
              </Box>
            )}

            {content.shippingInfo && (
              <Box bg={sectionBg} p={6} borderRadius="xl">
                <Heading size="sm" color={textColor} mb={2}>
                  Shipping Information
                </Heading>
                <Text color={subTextColor} fontSize="sm" whiteSpace="pre-wrap">
                  {content.shippingInfo}
                </Text>
              </Box>
            )}
          </SimpleGrid>
        )}
      </VStack>

      {/* Order Modal with Form */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Order: {selectedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmitOrder}>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {/* Product Summary */}
                {selectedProduct?.image && (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    borderRadius="md"
                    maxH="200px"
                    w="100%"
                    objectFit="cover"
                  />
                )}

                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color={priceColor}>
                    ₱{selectedProduct?.price.toFixed(2)}
                  </Text>
                  {selectedProduct?.description && (
                    <Text color={subTextColor} mt={2}>
                      {selectedProduct.description}
                    </Text>
                  )}
                </Box>

                <Divider />

                <Heading size="sm">Your Information</Heading>

                {/* Customer Name */}
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.customerName}
                    onChange={(e) =>
                      updateFormField("customerName", e.target.value)
                    }
                    placeholder="Juan Dela Cruz"
                  />
                </FormControl>

                {/* Customer Email */}
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      updateFormField("customerEmail", e.target.value)
                    }
                    placeholder="juan@example.com"
                  />
                </FormControl>

                {/* Customer Phone */}
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      updateFormField("customerPhone", e.target.value)
                    }
                    placeholder="+63 912 345 6789"
                  />
                </FormControl>

                {/* Quantity */}
                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput
                    value={formData.quantity}
                    onChange={(valueString) =>
                      updateFormField("quantity", parseInt(valueString) || 1)
                    }
                    min={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color={subTextColor} mt={1}>
                    Total: ₱
                    {(selectedProduct?.price * formData.quantity).toFixed(2)}
                  </Text>
                </FormControl>

                {/* Shipping Address */}
                <FormControl>
                  <FormLabel>Shipping Address</FormLabel>
                  <Textarea
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      updateFormField("shippingAddress", e.target.value)
                    }
                    placeholder="Street Address, Barangay, City, Province, Postal Code"
                    rows={3}
                  />
                </FormControl>

                {/* Additional Notes */}
                <FormControl>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      updateFormField("additionalNotes", e.target.value)
                    }
                    placeholder="Any special instructions or questions?"
                    rows={2}
                  />
                </FormControl>

                {/* Contact Information */}
                {(content?.contactEmail || content?.contactPhone) && (
                  <Box bg={sectionBg} p={4} borderRadius="md">
                    <Text fontSize="sm" color={subTextColor}>
                      We will contact you shortly to confirm your order.
                    </Text>
                    <HStack spacing={4} mt={2} flexWrap="wrap">
                      {content.contactEmail && (
                        <HStack>
                          <EmailIcon color={priceColor} />
                          <Text fontSize="sm" color={textColor}>
                            {content.contactEmail}
                          </Text>
                        </HStack>
                      )}
                      {content.contactPhone && (
                        <HStack>
                          <PhoneIcon color={priceColor} />
                          <Text fontSize="sm" color={textColor}>
                            {content.contactPhone}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                isLoading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit Order
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
