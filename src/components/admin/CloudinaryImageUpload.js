/**
 * Cloudinary Image Upload Component
 * Reusable component for uploading images to Cloudinary
 */

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Image,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  IconButton,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUpload, FaTrash, FaCheck } from "react-icons/fa";
import imageCompression from "browser-image-compression";

const CloudinaryImageUpload = ({
  onUploadSuccess,
  imageType = "general",
  currentImage = null,
  onDelete = null,
  apiEndpoint = "/api/cloudinary/upload",
  requireAuth = true,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("#A0A0A0", "#C0C0C0");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const originalSize = (selectedFile.size / 1024 / 1024).toFixed(2);
      console.log("Starting upload:", {
        fileName: selectedFile.name,
        fileSize: `${originalSize} MB`,
        fileType: selectedFile.type,
        endpoint: apiEndpoint,
      });

      // Compress image before upload for faster performance
      let fileToUpload = selectedFile;

      // Only compress if file is larger than 500KB (0.5MB)
      if (selectedFile.size > 512 * 1024) {
        toast({
          title: "Compressing image...",
          description: "Optimizing image for faster upload",
          status: "info",
          duration: 2000,
        });

        const options = {
          maxSizeMB: 1.5, // Max 1.5MB after compression
          maxWidthOrHeight: 1920, // Max dimension (HD resolution)
          useWebWorker: true,
          fileType: selectedFile.type,
          initialQuality: 0.8, // Good quality balance
        };

        try {
          fileToUpload = await imageCompression(selectedFile, options);
          const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
          console.log(
            `Image compressed: ${originalSize} MB → ${compressedSize} MB`
          );
        } catch (compressionError) {
          console.error(
            "Compression failed, using original:",
            compressionError
          );
          // Continue with original file if compression fails
        }
      }

      const formData = new FormData();
      formData.append("image", fileToUpload);
      formData.append("type", imageType);

      const headers = {};
      if (requireAuth) {
        headers.Authorization = `Bearer ${localStorage.getItem("adminToken")}`;
      }

      const startTime = Date.now();
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers,
        body: formData,
      });

      const uploadTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`Upload completed in ${uploadTime} seconds`);

      const data = await response.json();

      if (data.success) {
        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        const compressionInfo =
          fileToUpload !== selectedFile
            ? ` (compressed to ${compressedSize} MB)`
            : "";

        toast({
          title: "Image uploaded!",
          description: `Uploaded in ${uploadTime}s${compressionInfo}`,
          status: "success",
          duration: 4000,
        });

        // Call success callback with image data
        if (onUploadSuccess) {
          onUploadSuccess({
            url: data.image.url,
            publicId: data.image.publicId,
            width: data.image.width,
            height: data.image.height,
            format: data.image.format,
            size: data.image.size,
          });
        }

        setPreview(data.image.url);
        setSelectedFile(null);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage?.publicId) return;

    setDeleting(true);

    try {
      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: currentImage.publicId }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Image deleted",
          description: "Image removed from Cloudinary",
          status: "success",
          duration: 3000,
        });

        setPreview(null);
        setSelectedFile(null);

        if (onDelete) {
          onDelete();
        }
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="sm">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontWeight="bold">Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              size="sm"
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Max size: 10MB. Supported: JPG, PNG, WebP, GIF
            </Text>
            {selectedFile && (
              <Text fontSize="xs" color="blue.500" mt={1} fontWeight="medium">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                {selectedFile.size > 512 * 1024 &&
                  " - Will be compressed before upload ⚡"}
              </Text>
            )}
          </FormControl>

          {preview && (
            <Box
              position="relative"
              borderRadius="md"
              overflow="hidden"
              border="2px solid"
              borderColor={borderColor}
            >
              <Image
                src={preview}
                alt="Preview"
                maxH="300px"
                w="100%"
                objectFit="contain"
              />
              {currentImage?.publicId && (
                <IconButton
                  icon={<FaTrash />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  colorScheme="red"
                  onClick={handleDelete}
                  isLoading={deleting}
                  aria-label="Delete image"
                />
              )}
            </Box>
          )}

          {selectedFile && !uploading && (
            <HStack spacing={3}>
              <Button
                leftIcon={<FaUpload />}
                onClick={handleUpload}
                bg={useColorModeValue("gray.800", "gray.200")}
                color={useColorModeValue("white", "gray.900")}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.300"),
                }}
                flex={1}
              >
                Upload to Cloudinary
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(currentImage);
                }}
              >
                Cancel
              </Button>
            </HStack>
          )}

          {uploading && (
            <HStack spacing={3} p={4} justify="center">
              <Spinner color={accentColor} />
              <VStack spacing={1} align="start">
                <Text color={accentColor} fontWeight="bold">
                  Uploading to Cloudinary...
                </Text>
                {selectedFile && (
                  <Text fontSize="xs" color="gray.500">
                    {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Text>
                )}
              </VStack>
            </HStack>
          )}

          {currentImage?.url && !selectedFile && (
            <HStack spacing={2} color="green.500">
              <FaCheck />
              <Text fontSize="sm">Image uploaded successfully</Text>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default CloudinaryImageUpload;
