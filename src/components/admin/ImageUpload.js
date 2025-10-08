import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Image,
  Text,
  useToast,
  IconButton,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { AttachmentIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";

export default function ImageUpload({ label, value, onChange, placeholder }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (jpg, png, gif, etc.)",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // If there was a previous image from our server, delete it
        if (value && value.startsWith("/images/")) {
          try {
            await fetch("/api/admin/delete-image", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ imagePath: value }),
            });
            // Silently delete old image, don't show error if it fails
          } catch (err) {
            console.warn("Could not delete old image:", err);
          }
        }

        onChange(data.path);
        setPreviewUrl(data.path);
        toast({
          title: "Upload Successful",
          description: `Image uploaded: ${data.filename}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPreviewUrl(value);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearImage = async () => {
    // If the image is from our server (starts with /images/), delete it
    if (value && value.startsWith("/images/")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("/api/admin/delete-image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imagePath: value }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Image Deleted",
            description: "Image removed from server",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Still clear the field even if delete fails (file might not exist)
          console.warn("Failed to delete image from server:", data.error);
        }
      } catch (error) {
        console.error("Delete error:", error);
        // Continue to clear the field even if delete fails
      }
    }

    // Clear the field and preview
    setPreviewUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <VStack spacing={3} align="stretch">
        {/* Preview */}
        {previewUrl && (
          <Box
            position="relative"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            maxW="300px"
          >
            <Image
              src={previewUrl}
              alt="Preview"
              maxH="200px"
              objectFit="cover"
              w="full"
            />
            <IconButton
              icon={<DeleteIcon />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              colorScheme="red"
              onClick={handleClearImage}
              aria-label="Remove image"
            />
          </Box>
        )}

        {/* Manual input for image path */}
        <HStack>
          <Input
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            placeholder={placeholder || "/images/your-image.jpg"}
          />
          {value && value === previewUrl && <CheckIcon color="green.500" />}
        </HStack>

        {/* Upload button */}
        <HStack>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Button
            leftIcon={isUploading ? <Spinner size="sm" /> : <AttachmentIcon />}
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            loadingText="Uploading..."
            variant="outline"
            borderColor={useColorModeValue("gray.700", "gray.300")}
            color={useColorModeValue("gray.700", "gray.300")}
            _hover={{
              bg: useColorModeValue("gray.100", "gray.700"),
            }}
            size="sm"
          >
            Upload New Image
          </Button>
          <Text fontSize="xs" color="gray.500">
            (Max 5MB, JPG/PNG/GIF)
          </Text>
        </HStack>
      </VStack>
    </FormControl>
  );
}
