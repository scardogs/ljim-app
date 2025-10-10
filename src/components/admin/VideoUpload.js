/**
 * Video/GIF Upload Component for Cloudinary
 * Upload videos and GIFs directly to Cloudinary
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
  Progress,
} from "@chakra-ui/react";
import {
  AttachmentIcon,
  DeleteIcon,
  CheckIcon,
  LinkIcon,
} from "@chakra-ui/icons";

export default function VideoUpload({
  label,
  value,
  onChange,
  placeholder,
  mediaType = "video", // "video" or "gif"
  imageType = "general",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const buttonBg = useColorModeValue("gray.800", "gray.200");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.700", "gray.300");

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type.startsWith("video/");
    const isGif = file.type === "image/gif";

    if (mediaType === "video" && !isVideo) {
      toast({
        title: "Invalid File",
        description: "Please select a video file (MP4, WebM, etc.)",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (mediaType === "gif" && !isGif) {
      toast({
        title: "Invalid File",
        description: "Please select a GIF file",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (50MB for videos, 10MB for GIFs)
    const maxSize = mediaType === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `${
          mediaType === "video" ? "Video" : "GIF"
        } must be less than ${mediaType === "video" ? "50MB" : "10MB"}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Upload to Cloudinary
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileSize = (file.size / 1024 / 1024).toFixed(2);
      console.log(`Starting Cloudinary ${mediaType} upload:`, {
        fileName: file.name,
        fileSize: `${fileSize} MB`,
      });

      // Create preview for videos (blob URL)
      if (mediaType === "video") {
        const blobUrl = URL.createObjectURL(file);
        setPreviewUrl(blobUrl);
      }

      toast({
        title: `Uploading ${mediaType}...`,
        description: "This may take a minute for larger files",
        status: "info",
        duration: 3000,
      });

      // Upload to Cloudinary with progress tracking
      const formData = new FormData();
      formData.append(mediaType === "video" ? "video" : "image", file);
      formData.append("type", imageType);
      formData.append(
        "resource_type",
        mediaType === "video" ? "video" : "image"
      );

      const token = localStorage.getItem("adminToken");
      const startTime = Date.now();

      // Use XMLHttpRequest for upload progress tracking
      const data = await new Promise((resolve, reject) => {
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

        // Open and send request
        xhr.open(
          "POST",
          mediaType === "video"
            ? "/api/cloudinary/upload-video"
            : "/api/cloudinary/upload"
        );
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });

      const uploadTime = ((Date.now() - startTime) / 1000).toFixed(2);

      if (data.success) {
        setUploadProgress(100);

        // For videos, use the URL directly; for GIFs (images), use image.url
        const uploadedUrl = data.url || data.image?.url;
        onChange(uploadedUrl);
        setPreviewUrl(uploadedUrl);

        toast({
          title: "Upload Successful",
          description: `${
            mediaType === "video" ? "Video" : "GIF"
          } uploaded to Cloudinary in ${uploadTime}s`,
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
        description: error.message || `Failed to upload ${mediaType}`,
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

  const handleClearMedia = () => {
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
            maxW="400px"
          >
            {mediaType === "video" ? (
              <video
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "250px",
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
                  maxHeight: "250px",
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
              onClick={handleClearMedia}
              aria-label="Remove media"
            />
            {previewUrl.includes("res.cloudinary.com") && (
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
                  accept={mediaType === "video" ? "video/*" : "image/gif"}
                  style={{ display: "none" }}
                />
                <Button
                  leftIcon={
                    isUploading ? <Spinner size="sm" /> : <AttachmentIcon />
                  }
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={isUploading}
                  loadingText={`Uploading ${mediaType}...`}
                  variant="outline"
                  borderColor={borderColor}
                  size="sm"
                  w="full"
                >
                  {isUploading
                    ? `Uploading...`
                    : `Choose ${
                        mediaType === "video" ? "Video" : "GIF"
                      } to Upload`}
                </Button>
                <Text fontSize="xs" color="gray.500">
                  {mediaType === "video"
                    ? "Max 50MB. Supported: MP4, WebM, MOV. Uploaded to Cloudinary with automatic optimization."
                    : "Max 10MB. GIF files only. Uploaded to Cloudinary with automatic optimization."}
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
                    placeholder={
                      placeholder ||
                      `https://res.cloudinary.com/.../your-${mediaType}.${
                        mediaType === "video" ? "mp4" : "gif"
                      }`
                    }
                    size="sm"
                  />
                  {value && value === previewUrl && (
                    <CheckIcon color="green.500" />
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  Enter a full URL. For best performance, upload to Cloudinary
                  instead.
                </Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </FormControl>
  );
}
