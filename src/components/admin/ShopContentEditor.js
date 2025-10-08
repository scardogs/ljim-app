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
  SimpleGrid,
  IconButton,
  Input,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { StarIcon, DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { FiShoppingBag, FiPackage, FiCreditCard } from "react-icons/fi";
import ImageUpload from "./ImageUpload";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function ShopContentEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      const response = await fetch("/api/admin/shop");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load shop content",
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
      const response = await fetch("/api/admin/shop", {
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
          description: "Shop page content updated successfully",
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
        description: "Failed to save shop content",
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

  const handleAddProduct = () => {
    setEditingProduct({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "General",
      inStock: true,
    });
    setEditingIndex(null);
    onOpen();
  };

  const handleEditProduct = (product, index) => {
    setEditingProduct({ ...product });
    setEditingIndex(index);
    onOpen();
  };

  const handleSaveProduct = () => {
    if (!editingProduct.name || editingProduct.price < 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a product name and valid price",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const products = [...(content.products || [])];
    if (editingIndex !== null) {
      products[editingIndex] = editingProduct;
    } else {
      products.push(editingProduct);
    }

    setContent((prev) => ({
      ...prev,
      products,
    }));

    onClose();
    setEditingProduct(null);
    setEditingIndex(null);
  };

  const handleDeleteProduct = (index) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const products = content.products.filter((_, i) => i !== index);
      setContent((prev) => ({
        ...prev,
        products,
      }));
    }
  };

  const updateProductField = (field, value) => {
    setEditingProduct((prev) => ({
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
          <Heading size={{ base: "md", md: "lg" }}>Shop Page Content</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Manage products and shop information
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
            <SectionHeader icon={FiShoppingBag} title="Main Section" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Page Title</FormLabel>
                <DebouncedInput
                  value={content.title || ""}
                  onChange={(value) => updateField("title", value)}
                  size="lg"
                  placeholder="Shop"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Subtitle</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Brief description of your shop
                </Text>
                <DebouncedTextarea
                  value={content.subtitle || ""}
                  onChange={(value) => updateField("subtitle", value)}
                  rows={3}
                  placeholder="Browse our collection of ministry resources and merchandise."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Products Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <Flex justify="space-between" align="center" mb={4}>
              <SectionHeader icon={FiPackage} title="Products" />
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </Flex>

            {content.products && content.products.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {content.products.map((product, index) => (
                  <Card key={index} variant="outline">
                    <CardBody>
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          borderRadius="md"
                          h="150px"
                          w="100%"
                          objectFit="cover"
                          mb={3}
                        />
                      )}
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="100%">
                          <Heading size="sm">{product.name}</Heading>
                          {!product.inStock && (
                            <Badge colorScheme="red">Out of Stock</Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {product.description}
                        </Text>
                        <Text fontWeight="bold" color="blue.600">
                          ${product.price.toFixed(2)}
                        </Text>
                        <Badge colorScheme="blue">{product.category}</Badge>
                        <HStack spacing={2} w="100%" mt={2}>
                          <IconButton
                            size="sm"
                            icon={<EditIcon />}
                            onClick={() => handleEditProduct(product, index)}
                            flex={1}
                          />
                          <IconButton
                            size="sm"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            onClick={() => handleDeleteProduct(index)}
                            flex={1}
                          />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500" textAlign="center" py={8}>
                No products added yet. Click &quot;Add Product&quot; to get
                started.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Order Information */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiShoppingBag} title="Order Information" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Order Instructions</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Tell customers how to place an order
                </Text>
                <DebouncedTextarea
                  value={content.orderInstructions || ""}
                  onChange={(value) => updateField("orderInstructions", value)}
                  rows={4}
                  placeholder="To place an order, please contact us or fill out the order form."
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Contact Email</FormLabel>
                  <DebouncedInput
                    value={content.contactEmail || ""}
                    onChange={(value) => updateField("contactEmail", value)}
                    placeholder="shop@example.com"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Contact Phone</FormLabel>
                  <DebouncedInput
                    value={content.contactPhone || ""}
                    onChange={(value) => updateField("contactPhone", value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Payment & Shipping */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiCreditCard} title="Payment & Shipping" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Payment Methods</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  List accepted payment methods
                </Text>
                <DebouncedTextarea
                  value={content.paymentMethods || ""}
                  onChange={(value) => updateField("paymentMethods", value)}
                  rows={4}
                  placeholder="Cash, Credit Card, Bank Transfer, PayPal"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">
                  Shipping Information
                </FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Describe shipping policies and fees
                </Text>
                <DebouncedTextarea
                  value={content.shippingInfo || ""}
                  onChange={(value) => updateField("shippingInfo", value)}
                  rows={4}
                  placeholder="Free shipping on orders over $50. Standard delivery: 5-7 business days."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingIndex !== null ? "Edit Product" : "Add New Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={editingProduct?.name || ""}
                  onChange={(e) => updateProductField("name", e.target.value)}
                  placeholder="Product name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    updateProductField("description", e.target.value)
                  }
                  placeholder="Product description"
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price ($)</FormLabel>
                <NumberInput
                  value={editingProduct?.price || 0}
                  onChange={(valueString) =>
                    updateProductField("price", parseFloat(valueString) || 0)
                  }
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  value={editingProduct?.category || ""}
                  onChange={(e) =>
                    updateProductField("category", e.target.value)
                  }
                  placeholder="General"
                />
              </FormControl>

              <ImageUpload
                label="Product Image"
                value={editingProduct?.image || ""}
                onChange={(value) => updateProductField("image", value)}
                placeholder="/images/product.jpg"
              />

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">In Stock</FormLabel>
                <Switch
                  isChecked={editingProduct?.inStock || false}
                  onChange={(e) =>
                    updateProductField("inStock", e.target.checked)
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveProduct}>
              Save Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
