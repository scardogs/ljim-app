/**
 * Improved Image Upload Component
 * Supports both Cloudinary and manual URL input
 * Automatically uses Cloudinary for new uploads
 */

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Text,
  useToast,
  IconButton,
  Spinner,
  useColorModeValue,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
} from "@chakra-ui/react";
import {
  AttachmentIcon,
  DeleteIcon,
  CheckIcon,
  LinkIcon,
} from "@chakra-ui/icons";
import { CldImage } from "next-cloudinary";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { Progress } from "@chakra-ui/react";

export default function ImprovedImageUpload({
  label,
  value,
  onChange,
  placeholder,
  imageType = "general",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [tabIndex, setTabIndex] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const buttonBg = useColorModeValue("gray.800", "gray.200");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.700", "gray.300");

  // Check if current value is a Cloudinary URL
  const isCloudinaryImage = (url) => {
    return (
      url &&
      (url.includes("res.cloudinary.com") ||
        url.includes("cloudinary://") ||
        (!url.startsWith("http") && !url.startsWith("/")))
    );
  };

  // Extract public ID from Cloudinary URL
  const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length > 1) {
        let publicId = parts[1].replace(/^v\d+\//, "");
        return publicId.split(".")[0];
      }
    }
    return url;
  };

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

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      console.log("Starting Cloudinary upload:", {
        fileName: file.name,
        fileSize: `${originalSize} MB`,
      });

      // Compress image before upload for faster performance
      let fileToUpload = file;
      if (file.size > 512 * 1024) {
        toast({
          title: "Compressing image...",
          description: "Optimizing for faster upload",
          status: "info",
          duration: 2000,
        });

        const options = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: file.type,
          initialQuality: 0.8,
        };

        try {
          fileToUpload = await imageCompression(file, options);
          const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
          console.log(
            `Image compressed: ${originalSize} MB → ${compressedSize} MB`
          );
        } catch (compressionError) {
          console.error(
            "Compression failed, using original:",
            compressionError
          );
        }
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(fileToUpload);

      // Get Cloudinary cloud name for direct upload
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Cloudinary cloud name not configured");
      }

      const startTime = Date.now();

      // Upload directly to Cloudinary (bypasses Vercel's 4.5MB limit)
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "ljim_unsigned"); // Upload preset in Cloudinary
      formData.append("folder", `church-images/${imageType}`);

      // Use XMLHttpRequest for upload progress tracking
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        // Handle successful completion
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Invalid response from server"));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error || "Upload failed"));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        // Handle errors
        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        // Upload directly to Cloudinary
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        );
        xhr.send(formData);
      });

      // Transform response to match expected format
      const data = {
        success: true,
        image: {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
          format: cloudinaryResponse.format,
          size: cloudinaryResponse.bytes,
        },
      };

      const uploadTime = ((Date.now() - startTime) / 1000).toFixed(2);

      if (data.success) {
        // Delete old Cloudinary image if exists
        if (value && isCloudinaryImage(value)) {
          try {
            const publicId = getPublicIdFromUrl(value);
            if (publicId) {
              await fetch("/api/cloudinary/delete", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ publicId }),
              });
            }
          } catch (err) {
            console.warn("Could not delete old Cloudinary image:", err);
          }
        }

        onChange(data.image.url);
        setPreviewUrl(data.image.url);

        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        const compressionInfo =
          fileToUpload !== file ? ` (compressed to ${compressedSize} MB)` : "";

        toast({
          title: "Upload Successful",
          description: `Uploaded to Cloudinary in ${uploadTime}s${compressionInfo}`,
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
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearImage = async () => {
    // If it's a Cloudinary image, delete it
    if (value && isCloudinaryImage(value)) {
      try {
        const publicId = getPublicIdFromUrl(value);
        if (publicId) {
          const token = localStorage.getItem("adminToken");
          await fetch("/api/cloudinary/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ publicId }),
          });

          toast({
            title: "Image Deleted",
            description: "Image removed from Cloudinary",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    // Clear the field
    setPreviewUrl("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl>
      {label && <FormLabel fontWeight="semibold">{label}</FormLabel>}
      <VStack spacing={3} align="stretch">
        {/* Preview */}
        {previewUrl && (
          <Box
            position="relative"
            borderWidth="1px"
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
            maxW="300px"
          >
            {isCloudinaryImage(previewUrl) ? (
              <CldImage
                src={getPublicIdFromUrl(previewUrl)}
                alt="Preview"
                width={300}
                height={200}
                crop="fill"
                gravity="auto"
                quality="auto"
                format="auto"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            )}
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
            {isCloudinaryImage(previewUrl) && (
              <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="green"
                fontSize="xs"
              >
                Cloudinary ⚡
              </Badge>
            )}
          </Box>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.500">
                Uploading to Cloudinary...
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="green.500">
                {uploadProgress}%
              </Text>
            </HStack>
            <Progress
              value={uploadProgress}
              size="sm"
              colorScheme="green"
              borderRadius="md"
              hasStripe
              isAnimated
            />
          </Box>
        )}

        {/* Tabs for Upload vs Manual URL */}
        <Tabs
          size="sm"
          variant="enclosed"
          index={tabIndex}
          onChange={setTabIndex}
        >
          <TabList>
            <Tab>
              <AttachmentIcon mr={2} />
              Upload to Cloudinary
            </Tab>
            <Tab>
              <LinkIcon mr={2} />
              Manual URL
            </Tab>
          </TabList>

          <TabPanels>
            {/* Upload Tab */}
            <TabPanel px={0} pt={3}>
              <VStack spacing={3} align="stretch">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Button
                  leftIcon={
                    isUploading ? <Spinner size="sm" /> : <AttachmentIcon />
                  }
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={isUploading}
                  loadingText="Uploading to Cloudinary..."
                  variant="outline"
                  borderColor={borderColor}
                  size="sm"
                  w="full"
                >
                  {isUploading ? "Uploading..." : "Choose Image to Upload"}
                </Button>
                <Text fontSize="xs" color="gray.500">
                  Max 10MB. Images uploaded to Cloudinary for fast delivery with
                  automatic optimization (WebP/AVIF).
                </Text>
              </VStack>
            </TabPanel>

            {/* Manual URL Tab */}
            <TabPanel px={0} pt={3}>
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Input
                    value={value || ""}
                    onChange={(e) => {
                      onChange(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    placeholder={placeholder || "https://... or /images/..."}
                    size="sm"
                  />
                  {value && value === previewUrl && (
                    <CheckIcon color="green.500" />
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  Enter a full URL or path. For best performance, upload to
                  Cloudinary instead.
                </Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </FormControl>
  );
}
