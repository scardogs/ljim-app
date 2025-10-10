import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Divider,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
  useColorModeValue,
  Badge,
  Flex,
  Icon,
  Select,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, StarIcon } from "@chakra-ui/icons";
import {
  FiImage,
  FiFileText,
  FiAward,
  FiUsers,
  FiTarget,
  FiMusic,
  FiCamera,
  FiStar,
  FiMapPin,
} from "react-icons/fi";
import ImprovedImageUpload from "./ImprovedImageUpload";
import VideoUpload from "./VideoUpload";
import ColorPicker from "./ColorPicker";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function HomepageContentEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");

  // Header colors
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  // Button colors
  const addButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const addButtonColor = useColorModeValue("gray.700", "gray.300");
  const addButtonHoverBg = useColorModeValue("gray.100", "gray.700");

  // Card header colors
  const cardHeaderBg = useColorModeValue("white", "gray.700");

  const fetchContent = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load homepage content",
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
      const response = await fetch("/api/admin/homepage", {
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
          description: "Homepage content updated successfully",
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
        description: "Failed to save homepage content",
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

  const updateArrayField = (field, index, value) => {
    setContent((prev) => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addArrayItem = (field, defaultValue) => {
    setContent((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setContent((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const updateMissionValue = (index, field, value) => {
    setContent((prev) => ({
      ...prev,
      missionValues: (prev.missionValues || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateMinistry = (index, field, value) => {
    setContent((prev) => ({
      ...prev,
      ministries: (prev.ministries || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
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

  const SectionHeader = ({ icon, title, count }) => (
    <Flex align="center" gap={3} mb={4}>
      <Icon as={icon} boxSize={6} color="gray.600" />
      <Heading size="md">{title}</Heading>
      {count !== undefined && (
        <Badge colorScheme="gray" fontSize="sm">
          {count} {count === 1 ? "item" : "items"}
        </Badge>
      )}
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
          <Heading size={{ base: "md", md: "lg" }}>Homepage Content</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Manage all sections of your homepage
          </Text>
        </VStack>
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{
            bg: buttonHoverBg,
          }}
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

      <Tabs variant="soft-rounded" colorScheme="gray" px={{ base: 2, md: 6 }}>
        <TabList
          mb={{ base: 4, md: 8 }}
          flexWrap="wrap"
          gap={2}
          overflowX="auto"
        >
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiImage}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Hero</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiFileText}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Main</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiAward}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Mission</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiUsers}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Ministries</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiTarget}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>CTA</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiMusic}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Leaders</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiCamera}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Gallery</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiStar}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Showcase</Text>
          </Tab>
          <Tab
            _selected={{ bg: "gray.700", color: "white" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 2, md: 2 }}
          >
            <Icon
              as={FiMapPin}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Locations</Text>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Hero Section Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius={{ base: "lg", md: "xl" }}
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <SectionHeader icon={FiImage} title="Hero Section" />
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Hero Title</FormLabel>
                      <DebouncedInput
                        value={content.heroTitle || ""}
                        onChange={(value) => updateField("heroTitle", value)}
                        size="lg"
                        placeholder="Lift Jesus International Ministries"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Button Text</FormLabel>
                      <DebouncedInput
                        value={content.heroButtonText || ""}
                        onChange={(value) =>
                          updateField("heroButtonText", value)
                        }
                        size="lg"
                        placeholder="Learn More"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel fontWeight="semibold">Hero Subtitle</FormLabel>
                    <Text fontSize="xs" color="gray.500" mb={2}>
                      This text will appear with a typing animation effect
                    </Text>
                    <DebouncedTextarea
                      value={content.heroSubtitle || ""}
                      onChange={(value) => updateField("heroSubtitle", value)}
                      rows={3}
                      placeholder="Exalting the name of Jesus..."
                    />
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel fontWeight="semibold">Hero Media Type</FormLabel>
                    <Text fontSize="xs" color="gray.500" mb={2}>
                      Choose between image, video, or GIF background
                    </Text>
                    <RadioGroup
                      value={content.heroMediaType || "image"}
                      onChange={(value) => updateField("heroMediaType", value)}
                    >
                      <Stack direction="row" spacing={4}>
                        <Radio value="image">Image</Radio>
                        <Radio value="video">Video</Radio>
                        <Radio value="gif">GIF</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  {content.heroMediaType === "image" ? (
                    <ImprovedImageUpload
                      label="Hero Background Image"
                      value={content.heroImage || ""}
                      onChange={(value) => updateField("heroImage", value)}
                      placeholder="/images/your-image.png"
                      imageType="homepage/hero"
                    />
                  ) : (
                    <VideoUpload
                      label={`Hero Background ${
                        content.heroMediaType === "video" ? "Video" : "GIF"
                      }`}
                      value={content.heroVideoUrl || ""}
                      onChange={(value) => updateField("heroVideoUrl", value)}
                      placeholder={
                        content.heroMediaType === "video"
                          ? "https://res.cloudinary.com/your-cloud/video/upload/..."
                          : "https://res.cloudinary.com/your-cloud/image/upload/.../animation.gif"
                      }
                      mediaType={content.heroMediaType}
                      imageType="homepage/hero"
                    />
                  )}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Main Content Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Main Title */}
              <Card
                bg={cardBg}
                shadow="lg"
                borderRadius={{ base: "lg", md: "xl" }}
              >
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader
                    icon={FiFileText}
                    title="Main Content Section"
                  />
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Section Title</FormLabel>
                      <DebouncedInput
                        value={content.mainTitle || ""}
                        onChange={(value) => updateField("mainTitle", value)}
                        size="lg"
                        placeholder="Lift Jesus International Ministries"
                      />
                    </FormControl>

                    <Divider />

                    <Box>
                      <FormLabel fontWeight="semibold">
                        Rotating Text Messages
                      </FormLabel>
                      <Text fontSize="xs" color="gray.500" mb={3}>
                        These texts will rotate with smooth animations
                      </Text>
                      <VStack spacing={3} align="stretch">
                        {content.mainRotatingTexts?.map((text, index) => (
                          <Card key={index} variant="outline" size="sm">
                            <CardBody>
                              <HStack align="start">
                                <Badge colorScheme="gray">{index + 1}</Badge>
                                <DebouncedTextarea
                                  value={text}
                                  onChange={(value) =>
                                    updateArrayField(
                                      "mainRotatingTexts",
                                      index,
                                      value
                                    )
                                  }
                                  rows={2}
                                  flex={1}
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() =>
                                    removeArrayItem("mainRotatingTexts", index)
                                  }
                                  aria-label="Delete text"
                                />
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                        <Button
                          leftIcon={<AddIcon />}
                          onClick={() => addArrayItem("mainRotatingTexts", "")}
                          variant="outline"
                          borderColor={addButtonBorderColor}
                          color={addButtonColor}
                          _hover={{
                            bg: addButtonHoverBg,
                          }}
                          size="sm"
                        >
                          Add Rotating Text
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Philippines Section */}
              <Card
                bg={cardBg}
                shadow="lg"
                borderRadius={{ base: "lg", md: "xl" }}
              >
                <CardBody p={{ base: 4, md: 8 }}>
                  <Heading size="sm" mb={4}>
                    Philippines Section
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Section Title</FormLabel>
                      <DebouncedInput
                        value={content.philippinesTitle || ""}
                        onChange={(value) =>
                          updateField("philippinesTitle", value)
                        }
                        placeholder="LJIM – Philippines"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Description</FormLabel>
                      <DebouncedTextarea
                        value={content.philippinesDescription || ""}
                        onChange={(value) =>
                          updateField("philippinesDescription", value)
                        }
                        rows={4}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Bible Verse</FormLabel>
                      <DebouncedTextarea
                        value={content.philippinesBibleVerse || ""}
                        onChange={(value) =>
                          updateField("philippinesBibleVerse", value)
                        }
                        rows={2}
                      />
                    </FormControl>

                    <Divider />

                    <Heading size="sm" mb={2}>
                      Philippines Map Images
                    </Heading>
                    <Text fontSize="xs" color="gray.500" mb={4}>
                      Upload different maps for light and dark mode
                    </Text>

                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                      <ImprovedImageUpload
                        label="Map Image (Light Mode)"
                        value={content.philippinesMapImageLight || ""}
                        onChange={(value) =>
                          updateField("philippinesMapImageLight", value)
                        }
                        placeholder="/images/map-ph.png"
                        imageType="homepage/map-light"
                      />

                      <ImprovedImageUpload
                        label="Map Image (Dark Mode)"
                        value={content.philippinesMapImageDark || ""}
                        onChange={(value) =>
                          updateField("philippinesMapImageDark", value)
                        }
                        placeholder="/images/white-map-ph.png"
                        imageType="homepage/map-dark"
                      />
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Mission & Values Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius={{ base: "lg", md: "xl" }}
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <SectionHeader
                  icon={FiAward}
                  title="Mission & Values Carousel"
                  count={content.missionValues?.length}
                />
                <Text fontSize="sm" color="gray.500" mb={6}>
                  These cards will appear in a rotating carousel on your
                  homepage
                </Text>

                <VStack spacing={4} align="stretch">
                  {content.missionValues?.map((item, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      borderColor={borderColor}
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              Card {index + 1}
                            </Badge>
                            <Text
                              fontWeight="bold"
                              fontSize="sm"
                              color="gray.500"
                            >
                              {item.title || "Untitled"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeArrayItem("missionValues", index)
                            }
                            aria-label="Delete card"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 6 }}>
                        <VStack spacing={{ base: 3, md: 4 }}>
                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={{ base: 3, md: 4 }}
                            w="full"
                          >
                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="semibold">
                                Title
                              </FormLabel>
                              <DebouncedInput
                                value={item.title}
                                onChange={(value) =>
                                  updateMissionValue(index, "title", value)
                                }
                                placeholder="Excellence in Faith"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="semibold">
                                Icon Name
                              </FormLabel>
                              <DebouncedInput
                                value={item.icon}
                                onChange={(value) =>
                                  updateMissionValue(index, "icon", value)
                                }
                                placeholder="StarIcon"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Description
                            </FormLabel>
                            <DebouncedTextarea
                              value={item.description}
                              onChange={(value) =>
                                updateMissionValue(index, "description", value)
                              }
                              rows={3}
                              placeholder="We strive for spiritual excellence..."
                            />
                          </FormControl>

                          <ColorPicker
                            label="Card Color"
                            value={item.color}
                            onChange={(value) =>
                              updateMissionValue(index, "color", value)
                            }
                          />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}

                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() =>
                      addArrayItem("missionValues", {
                        title: "",
                        description: "",
                        icon: "StarIcon",
                        color: "gray.600",
                      })
                    }
                    variant="outline"
                    borderColor={addButtonBorderColor}
                    color={addButtonColor}
                    _hover={{ bg: addButtonHoverBg }}
                    size="lg"
                  >
                    Add New Card
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Ministries Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius={{ base: "lg", md: "xl" }}
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <SectionHeader
                  icon={FiUsers}
                  title="Ministries Section"
                  count={content.ministries?.length}
                />
                <Text fontSize="sm" color="gray.500" mb={6}>
                  Showcase your church ministries and programs
                </Text>

                <VStack spacing={4} align="stretch">
                  {content.ministries?.map((item, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              #{index + 1}
                            </Badge>
                            <Text
                              fontWeight="bold"
                              fontSize="sm"
                              color="gray.500"
                            >
                              {item.title || "Untitled Ministry"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("ministries", index)}
                            aria-label="Delete ministry"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 6 }}>
                        <SimpleGrid
                          columns={{ base: 1, md: 2 }}
                          spacing={{ base: 3, md: 4 }}
                        >
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Ministry Title
                            </FormLabel>
                            <DebouncedInput
                              value={item.title}
                              onChange={(value) =>
                                updateMinistry(index, "title", value)
                              }
                              placeholder="Worship Ministry"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Icon
                            </FormLabel>
                            <DebouncedInput
                              value={item.icon}
                              onChange={(value) =>
                                updateMinistry(index, "icon", value)
                              }
                              placeholder="MusicNote"
                            />
                          </FormControl>
                          <FormControl gridColumn={{ base: "1", md: "1 / -1" }}>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Description
                            </FormLabel>
                            <DebouncedTextarea
                              value={item.description}
                              onChange={(value) =>
                                updateMinistry(index, "description", value)
                              }
                              rows={2}
                              placeholder="Leading believers into the presence of God..."
                            />
                          </FormControl>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ))}

                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() =>
                      addArrayItem("ministries", {
                        title: "",
                        description: "",
                        icon: "MusicNote",
                      })
                    }
                    variant="outline"
                    borderColor={addButtonBorderColor}
                    color={addButtonColor}
                    _hover={{ bg: addButtonHoverBg }}
                    size="lg"
                  >
                    Add New Ministry
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Call to Action Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius={{ base: "lg", md: "xl" }}
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <SectionHeader icon={FiTarget} title="Call to Action" />
                <Text fontSize="sm" color="gray.500" mb={6}>
                  Encourage visitors to take action with a prominent CTA button
                </Text>

                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">CTA Title</FormLabel>
                      <DebouncedInput
                        value={content.ctaTitle || ""}
                        onChange={(value) => updateField("ctaTitle", value)}
                        size="lg"
                        placeholder="Join Us in Lifting Jesus Higher"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Button Text</FormLabel>
                      <DebouncedInput
                        value={content.ctaButtonText || ""}
                        onChange={(value) =>
                          updateField("ctaButtonText", value)
                        }
                        size="lg"
                        placeholder="Get Connected"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel fontWeight="semibold">Description</FormLabel>
                    <DebouncedTextarea
                      value={content.ctaDescription || ""}
                      onChange={(value) => updateField("ctaDescription", value)}
                      rows={2}
                      placeholder="Be part of a community..."
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Worship Leaders Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Section Info */}
              <Card
                bg={cardBg}
                shadow="lg"
                borderRadius={{ base: "lg", md: "xl" }}
              >
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader
                    icon={FiMusic}
                    title="Worship Leaders Section"
                    count={content.singers?.length}
                  />
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Section Title</FormLabel>
                      <DebouncedInput
                        value={content.singersTitle || ""}
                        onChange={(value) => updateField("singersTitle", value)}
                        size="lg"
                        placeholder="Worship Leaders"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">
                        Section Description
                      </FormLabel>
                      <DebouncedTextarea
                        value={content.singersDescription || ""}
                        onChange={(value) =>
                          updateField("singersDescription", value)
                        }
                        rows={2}
                        placeholder="Voices united in harmony..."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Bible Verse</FormLabel>
                      <DebouncedTextarea
                        value={content.singersBibleVerse || ""}
                        onChange={(value) =>
                          updateField("singersBibleVerse", value)
                        }
                        rows={2}
                        placeholder='"Sing to Him..." — 1 Chronicles 16:9'
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Singers List */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Worship Leaders
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  {content.singers?.map((singer, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              {index + 1}
                            </Badge>
                            <Text fontWeight="bold">
                              {singer.name || "Unnamed Singer"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("singers", index)}
                            aria-label="Delete singer"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 4 }}>
                        <VStack spacing={{ base: 3, md: 4 }}>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Name
                            </FormLabel>
                            <DebouncedInput
                              value={singer.name}
                              onChange={(value) =>
                                updateArrayField("singers", index, {
                                  ...singer,
                                  name: value,
                                })
                              }
                              placeholder="Joshua"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Tagline
                            </FormLabel>
                            <DebouncedTextarea
                              value={singer.tagline}
                              onChange={(value) =>
                                updateArrayField("singers", index, {
                                  ...singer,
                                  tagline: value,
                                })
                              }
                              rows={2}
                              placeholder="Leading hearts into worship..."
                            />
                          </FormControl>
                          <ImprovedImageUpload
                            label="Singer Photo"
                            value={singer.image}
                            onChange={(value) =>
                              updateArrayField("singers", index, {
                                ...singer,
                                image: value,
                              })
                            }
                            placeholder="/images/singer-name.jpg"
                            imageType="homepage/singers"
                          />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                <Button
                  leftIcon={<AddIcon />}
                  onClick={() =>
                    addArrayItem("singers", {
                      name: "",
                      tagline: "",
                      image: "/images/",
                    })
                  }
                  variant="outline"
                  borderColor={addButtonBorderColor}
                  color={addButtonColor}
                  _hover={{ bg: addButtonHoverBg }}
                  size="lg"
                  mt={4}
                  w="full"
                >
                  Add New Singer
                </Button>
              </Box>
            </VStack>
          </TabPanel>

          {/* Congregation Gallery Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Section Info */}
              <Card
                bg={cardBg}
                shadow="lg"
                borderRadius={{ base: "lg", md: "xl" }}
              >
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader
                    icon={FiCamera}
                    title="Congregation Gallery"
                    count={content.congregationPhotos?.length}
                  />
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Section Title</FormLabel>
                      <DebouncedInput
                        value={content.congregationTitle || ""}
                        onChange={(value) =>
                          updateField("congregationTitle", value)
                        }
                        size="lg"
                        placeholder="Our Congregation"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Description</FormLabel>
                      <DebouncedTextarea
                        value={content.congregationDescription || ""}
                        onChange={(value) =>
                          updateField("congregationDescription", value)
                        }
                        rows={2}
                        placeholder="A beautiful community of believers..."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Bible Verse</FormLabel>
                      <DebouncedTextarea
                        value={content.congregationBibleVerse || ""}
                        onChange={(value) =>
                          updateField("congregationBibleVerse", value)
                        }
                        rows={2}
                        placeholder='"For where two or three gather..." — Matthew 18:20'
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Photos List */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Congregation Photos
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  {content.congregationPhotos?.map((photo, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              {index + 1}
                            </Badge>
                            <Text fontWeight="bold">
                              {photo.caption || "Untitled Photo"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeArrayItem("congregationPhotos", index)
                            }
                            aria-label="Delete photo"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 4 }}>
                        <VStack spacing={{ base: 3, md: 4 }}>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Caption
                            </FormLabel>
                            <DebouncedInput
                              value={photo.caption}
                              onChange={(value) =>
                                updateArrayField("congregationPhotos", index, {
                                  ...photo,
                                  caption: value,
                                })
                              }
                              placeholder="Photo caption..."
                            />
                          </FormControl>
                          <ImprovedImageUpload
                            label="Photo"
                            value={photo.image}
                            onChange={(value) =>
                              updateArrayField("congregationPhotos", index, {
                                ...photo,
                                image: value,
                              })
                            }
                            placeholder="/images/congregation-photo.jpg"
                            imageType="congregation"
                          />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                <Button
                  leftIcon={<AddIcon />}
                  onClick={() =>
                    addArrayItem("congregationPhotos", {
                      caption: "",
                      image: "",
                    })
                  }
                  variant="outline"
                  borderColor={addButtonBorderColor}
                  color={addButtonColor}
                  _hover={{ bg: addButtonHoverBg }}
                  size="lg"
                  mt={4}
                  w="full"
                >
                  Add New Photo
                </Button>
              </Box>
            </VStack>
          </TabPanel>

          {/* Showcase Section Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Section Info */}
              <Card
                bg={cardBg}
                shadow="lg"
                borderRadius={{ base: "lg", md: "xl" }}
              >
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader
                    icon={FiStar}
                    title="Showcase Section"
                    count={content.showcaseItems?.length}
                  />
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Section Title</FormLabel>
                      <DebouncedInput
                        value={content.showcaseTitle || ""}
                        onChange={(value) =>
                          updateField("showcaseTitle", value)
                        }
                        size="lg"
                        placeholder="Highlights"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Description</FormLabel>
                      <DebouncedTextarea
                        value={content.showcaseDescription || ""}
                        onChange={(value) =>
                          updateField("showcaseDescription", value)
                        }
                        rows={2}
                        placeholder="Celebrating moments that matter..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Showcase Items List */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Showcase Items
                </Text>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  {content.showcaseItems?.map((item, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              {index + 1}
                            </Badge>
                            <Text fontWeight="bold">
                              {item.title || "Untitled Item"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeArrayItem("showcaseItems", index)
                            }
                            aria-label="Delete item"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 4 }}>
                        <VStack spacing={{ base: 3, md: 4 }}>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Title
                            </FormLabel>
                            <DebouncedInput
                              value={item.title}
                              onChange={(value) =>
                                updateArrayField("showcaseItems", index, {
                                  ...item,
                                  title: value,
                                })
                              }
                              placeholder="Item title..."
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Description
                            </FormLabel>
                            <DebouncedTextarea
                              value={item.description}
                              onChange={(value) =>
                                updateArrayField("showcaseItems", index, {
                                  ...item,
                                  description: value,
                                })
                              }
                              rows={2}
                              placeholder="Item description..."
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Link (Optional)
                            </FormLabel>
                            <DebouncedInput
                              value={item.link}
                              onChange={(value) =>
                                updateArrayField("showcaseItems", index, {
                                  ...item,
                                  link: value,
                                })
                              }
                              placeholder="https://..."
                            />
                          </FormControl>
                          <ImprovedImageUpload
                            label="Image"
                            value={item.image}
                            onChange={(value) =>
                              updateArrayField("showcaseItems", index, {
                                ...item,
                                image: value,
                              })
                            }
                            placeholder="/images/showcase-item.jpg"
                            imageType="showcase"
                          />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                <Button
                  leftIcon={<AddIcon />}
                  onClick={() =>
                    addArrayItem("showcaseItems", {
                      title: "",
                      description: "",
                      image: "",
                      link: "",
                    })
                  }
                  variant="outline"
                  borderColor={addButtonBorderColor}
                  color={addButtonColor}
                  _hover={{ bg: addButtonHoverBg }}
                  size="lg"
                  mt={4}
                  w="full"
                >
                  Add New Showcase Item
                </Button>
              </Box>
            </VStack>
          </TabPanel>

          {/* Regional Churches (Locations) Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius={{ base: "lg", md: "xl" }}
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <SectionHeader
                  icon={FiMapPin}
                  title="Church Locations"
                  count={content.regionalChurches?.length}
                />
                <Text fontSize="sm" color="gray.500" mb={6}>
                  Add churches in different regions (Luzon, Visayas, Mindanao)
                </Text>

                <VStack spacing={4} align="stretch">
                  {content.regionalChurches?.map((church, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderWidth="2px"
                      bg={sectionBg}
                    >
                      <CardHeader
                        bg={cardHeaderBg}
                        borderBottom="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Badge
                              colorScheme={
                                church.region === "Luzon"
                                  ? "blue"
                                  : church.region === "Visayas"
                                  ? "green"
                                  : "purple"
                              }
                              fontSize="md"
                              px={3}
                              py={1}
                            >
                              {church.region || "Unknown"}
                            </Badge>
                            <Text fontWeight="bold">
                              {church.churchName || "Untitled Church"}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeArrayItem("regionalChurches", index)
                            }
                            aria-label="Delete church"
                          />
                        </HStack>
                      </CardHeader>
                      <CardBody p={{ base: 3, md: 4 }}>
                        <VStack spacing={{ base: 3, md: 4 }}>
                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={{ base: 3, md: 4 }}
                            w="full"
                          >
                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="semibold">
                                Region
                              </FormLabel>
                              <Select
                                value={church.region || "Luzon"}
                                onChange={(e) =>
                                  updateArrayField("regionalChurches", index, {
                                    ...church,
                                    region: e.target.value,
                                  })
                                }
                              >
                                <option value="Luzon">Luzon</option>
                                <option value="Visayas">Visayas</option>
                                <option value="Mindanao">Mindanao</option>
                              </Select>
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="semibold">
                                Church Name
                              </FormLabel>
                              <DebouncedInput
                                value={church.churchName}
                                onChange={(value) =>
                                  updateArrayField("regionalChurches", index, {
                                    ...church,
                                    churchName: value,
                                  })
                                }
                                placeholder="LJIM Manila"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Address
                            </FormLabel>
                            <DebouncedTextarea
                              value={church.address}
                              onChange={(value) =>
                                updateArrayField("regionalChurches", index, {
                                  ...church,
                                  address: value,
                                })
                              }
                              rows={2}
                              placeholder="123 Main Street, Manila, Philippines"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Description
                            </FormLabel>
                            <DebouncedTextarea
                              value={church.description}
                              onChange={(value) =>
                                updateArrayField("regionalChurches", index, {
                                  ...church,
                                  description: value,
                                })
                              }
                              rows={2}
                              placeholder="Brief description of the church..."
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="semibold">
                              Contact Info
                            </FormLabel>
                            <DebouncedInput
                              value={church.contactInfo}
                              onChange={(value) =>
                                updateArrayField("regionalChurches", index, {
                                  ...church,
                                  contactInfo: value,
                                })
                              }
                              placeholder="+63 123 456 7890 or email@church.com"
                            />
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}

                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() =>
                      addArrayItem("regionalChurches", {
                        region: "Luzon",
                        churchName: "",
                        address: "",
                        description: "",
                        contactInfo: "",
                      })
                    }
                    variant="outline"
                    borderColor={addButtonBorderColor}
                    color={addButtonColor}
                    _hover={{ bg: addButtonHoverBg }}
                    size="lg"
                    w="full"
                  >
                    Add New Church Location
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Floating Save Button */}
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
