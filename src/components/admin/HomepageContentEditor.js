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
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, StarIcon } from "@chakra-ui/icons";
import {
  FiImage,
  FiFileText,
  FiAward,
  FiUsers,
  FiTarget,
  FiMusic,
} from "react-icons/fi";
import ImageUpload from "./ImageUpload";
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
    <Box maxW="1400px" mx="auto">
      {/* Header with Save Button */}
      <Flex
        position="sticky"
        top={0}
        bg={useColorModeValue("white", "gray.900")}
        zIndex={10}
        p={6}
        borderBottom="1px"
        borderColor={borderColor}
        justify="space-between"
        align="center"
        mb={6}
      >
        <VStack align="start" spacing={1}>
          <Heading size="lg">Homepage Content</Heading>
          <Text fontSize="sm" color="gray.500">
            Manage all sections of your homepage
          </Text>
        </VStack>
        <Button
          bg={useColorModeValue("gray.900", "gray.100")}
          color={useColorModeValue("white", "gray.900")}
          _hover={{
            bg: useColorModeValue("gray.800", "gray.200"),
          }}
          onClick={handleSave}
          isLoading={isSaving}
          loadingText="Saving..."
          size="lg"
          leftIcon={<Icon as={StarIcon} />}
        >
          Save Changes
        </Button>
      </Flex>

      <Tabs variant="soft-rounded" colorScheme="gray" px={6}>
        <TabList mb={8} flexWrap="wrap" gap={2}>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiImage} mr={2} />
            Hero
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiFileText} mr={2} />
            Main Content
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiAward} mr={2} />
            Mission & Values
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiUsers} mr={2} />
            Ministries
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiTarget} mr={2} />
            Call to Action
          </Tab>
          <Tab _selected={{ bg: "gray.700", color: "white" }}>
            <Icon as={FiMusic} mr={2} />
            Worship Leaders
          </Tab>
        </TabList>

        <TabPanels>
          {/* Hero Section Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={8}>
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

                  <ImageUpload
                    label="Hero Background Image"
                    value={content.heroImage || ""}
                    onChange={(value) => updateField("heroImage", value)}
                    placeholder="/images/your-image.png"
                  />
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Main Content Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Main Title */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={8}>
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
                          borderColor={useColorModeValue(
                            "gray.700",
                            "gray.300"
                          )}
                          color={useColorModeValue("gray.700", "gray.300")}
                          _hover={{
                            bg: useColorModeValue("gray.100", "gray.700"),
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
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={8}>
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
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Mission & Values Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={8}>
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
                        bg={useColorModeValue("white", "gray.700")}
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
                      <CardBody p={6}>
                        <VStack spacing={4}>
                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={4}
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
                    borderColor={useColorModeValue("gray.700", "gray.300")}
                    color={useColorModeValue("gray.700", "gray.300")}
                    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    size="lg"
                  >
                    Add New Card
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Ministries Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={8}>
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
                        bg={useColorModeValue("white", "gray.700")}
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
                      <CardBody p={6}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                    borderColor={useColorModeValue("gray.700", "gray.300")}
                    color={useColorModeValue("gray.700", "gray.300")}
                    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    size="lg"
                  >
                    Add New Ministry
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Call to Action Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={8}>
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
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Section Info */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={8}>
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
                        bg={useColorModeValue("white", "gray.700")}
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
                      <CardBody p={4}>
                        <VStack spacing={4}>
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
                          <ImageUpload
                            label="Singer Photo"
                            value={singer.image}
                            onChange={(value) =>
                              updateArrayField("singers", index, {
                                ...singer,
                                image: value,
                              })
                            }
                            placeholder="/images/singer-name.jpg"
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
                  borderColor={useColorModeValue("gray.700", "gray.300")}
                  color={useColorModeValue("gray.700", "gray.300")}
                  _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  size="lg"
                  mt={4}
                  w="full"
                >
                  Add New Singer
                </Button>
              </Box>
            </VStack>
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
          bg={useColorModeValue("gray.900", "gray.100")}
          color={useColorModeValue("white", "gray.900")}
          _hover={{ bg: useColorModeValue("gray.800", "gray.200") }}
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
