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
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

export default function Shop() {
  const [content, setContent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    onOpen();
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
      >
        <Text>Loading...</Text>
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
                      ${product.price.toFixed(2)}
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

      {/* Order Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Order: {selectedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {selectedProduct?.image && (
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  borderRadius="md"
                  maxH="200px"
                  objectFit="cover"
                />
              )}

              <Box>
                <Text fontSize="2xl" fontWeight="bold" color={priceColor}>
                  ${selectedProduct?.price.toFixed(2)}
                </Text>
                {selectedProduct?.description && (
                  <Text color={subTextColor} mt={2}>
                    {selectedProduct.description}
                  </Text>
                )}
              </Box>

              <Divider />

              <Box>
                <Heading size="sm" mb={2}>
                  How to Order
                </Heading>
                <Text color={subTextColor} whiteSpace="pre-wrap">
                  {content?.orderInstructions ||
                    "Please contact us to place your order."}
                </Text>
              </Box>

              {(content?.contactEmail || content?.contactPhone) && (
                <Box>
                  <Heading size="sm" mb={3}>
                    Contact Information
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    {content.contactEmail && (
                      <Link
                        href={`mailto:${content.contactEmail}?subject=Order Inquiry: ${selectedProduct?.name}`}
                        color={priceColor}
                        _hover={{ textDecoration: "underline" }}
                      >
                        <HStack>
                          <EmailIcon />
                          <Text>{content.contactEmail}</Text>
                        </HStack>
                      </Link>
                    )}
                    {content.contactPhone && (
                      <Link
                        href={`tel:${content.contactPhone}`}
                        color={priceColor}
                        _hover={{ textDecoration: "underline" }}
                      >
                        <HStack>
                          <PhoneIcon />
                          <Text>{content.contactPhone}</Text>
                        </HStack>
                      </Link>
                    )}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {content?.contactEmail && (
              <Button
                ml={3}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                as={Link}
                href={`mailto:${content.contactEmail}?subject=Order Inquiry: ${
                  selectedProduct?.name
                }&body=Hi, I would like to order ${
                  selectedProduct?.name
                } (${selectedProduct?.price.toFixed(2)}).`}
              >
                Send Email
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
