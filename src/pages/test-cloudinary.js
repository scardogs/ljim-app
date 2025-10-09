/**
 * Cloudinary Test Page
 * Test image upload and display with Cloudinary
 * Navigate to: http://localhost:3000/test-cloudinary
 * NOTE: Uses test endpoint (no authentication required)
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Code,
  Divider,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { CldImage } from "next-cloudinary";
import CloudinaryImageUpload from "../components/admin/CloudinaryImageUpload";

const TestCloudinaryPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const handleUploadSuccess = (imageData) => {
    setUploadedImage(imageData);
  };

  const handleDelete = () => {
    setUploadedImage(null);
  };

  return (
    <>
      <Navbar />

      <Box bg={bgColor} minH="100vh" pt={24} pb={12}>
        <Container maxW="container.lg">
          <VStack spacing={8} align="stretch">
            <VStack spacing={3} textAlign="center">
              <Heading size="xl" color={textColor}>
                Cloudinary Test Page
              </Heading>
              <Text color="gray.600">
                Test image upload and optimization with Cloudinary
              </Text>
            </VStack>

            <Divider />

            {/* Upload Component */}
            <Box>
              <Heading size="md" mb={4} color={textColor}>
                1. Upload Image
              </Heading>
              <CloudinaryImageUpload
                onUploadSuccess={handleUploadSuccess}
                imageType="test"
                currentImage={uploadedImage}
                onDelete={handleDelete}
                apiEndpoint="/api/cloudinary/test-upload"
                requireAuth={false}
              />
            </Box>

            {/* Display Uploaded Image */}
            {uploadedImage && (
              <>
                <Divider />

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    2. Image Details
                  </Heading>
                  <VStack align="start" spacing={2}>
                    <Text>
                      <strong>URL:</strong>{" "}
                      <Code fontSize="xs">{uploadedImage.url}</Code>
                    </Text>
                    <Text>
                      <strong>Public ID:</strong>{" "}
                      <Code fontSize="xs">{uploadedImage.publicId}</Code>
                    </Text>
                    <Text>
                      <strong>Dimensions:</strong> {uploadedImage.width} ×{" "}
                      {uploadedImage.height}
                    </Text>
                    <Text>
                      <strong>Format:</strong> {uploadedImage.format}
                    </Text>
                    <Text>
                      <strong>Size:</strong>{" "}
                      {(uploadedImage.size / 1024).toFixed(2)} KB
                    </Text>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    3. Optimized Display (Auto WebP/AVIF)
                  </Heading>
                  <Box
                    p={4}
                    bg={useColorModeValue("white", "gray.800")}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                  >
                    <CldImage
                      src={uploadedImage.publicId}
                      width={800}
                      height={600}
                      crop="fill"
                      gravity="auto"
                      quality="auto"
                      format="auto"
                      alt="Uploaded image"
                      style={{ borderRadius: "8px" }}
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    ✅ Automatically converted to WebP/AVIF for faster loading
                  </Text>
                </Box>

                <Divider />

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    4. Different Sizes (On-the-fly)
                  </Heading>
                  <VStack spacing={4}>
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Thumbnail (200×200, crop to faces)
                      </Text>
                      <CldImage
                        src={uploadedImage.publicId}
                        width={200}
                        height={200}
                        crop="thumb"
                        gravity="faces"
                        alt="Thumbnail"
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Medium (400×300)
                      </Text>
                      <CldImage
                        src={uploadedImage.publicId}
                        width={400}
                        height={300}
                        crop="fill"
                        alt="Medium"
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Large (800×600)
                      </Text>
                      <CldImage
                        src={uploadedImage.publicId}
                        width={800}
                        height={600}
                        crop="fill"
                        alt="Large"
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>
                  </VStack>
                  <Text fontSize="sm" color="gray.600" mt={4}>
                    ✅ All sizes generated on-the-fly from the same image!
                  </Text>
                </Box>

                <Divider />

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    5. Code Example
                  </Heading>
                  <Code
                    display="block"
                    whiteSpace="pre"
                    p={4}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {`import { CldImage } from 'next-cloudinary';

<CldImage
  src="${uploadedImage.publicId}"
  width={800}
  height={600}
  crop="fill"
  gravity="auto"
  quality="auto"
  format="auto"
  alt="Church image"
/>`}
                  </Code>
                </Box>
              </>
            )}

            {!uploadedImage && (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" fontSize="lg">
                  👆 Upload an image above to test Cloudinary
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default TestCloudinaryPage;
