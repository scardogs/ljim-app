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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
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
        <Spinner size="xl" color="gray.600" />
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

  return (
    <Box maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Homepage Content Editor</Heading>
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
          >
            Save Changes
          </Button>
        </HStack>

        <Accordion allowMultiple defaultIndex={[0]}>
          {/* Hero Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Hero Section
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Hero Title</FormLabel>
                  <DebouncedInput
                    value={content.heroTitle || ""}
                    onChange={(value) => updateField("heroTitle", value)}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Hero Subtitle</FormLabel>
                  <DebouncedTextarea
                    value={content.heroSubtitle || ""}
                    onChange={(value) => updateField("heroSubtitle", value)}
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Hero Button Text</FormLabel>
                  <DebouncedInput
                    value={content.heroButtonText || ""}
                    onChange={(value) => updateField("heroButtonText", value)}
                  />
                </FormControl>

                <ImageUpload
                  label="Hero Background Image"
                  value={content.heroImage || ""}
                  onChange={(value) => updateField("heroImage", value)}
                  placeholder="/images/your-image.png"
                />
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Main Content Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Main Content Section
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Main Title</FormLabel>
                  <DebouncedInput
                    value={content.mainTitle || ""}
                    onChange={(value) => updateField("mainTitle", value)}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Rotating Texts</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {content.mainRotatingTexts?.map((text, index) => (
                      <HStack key={index}>
                        <DebouncedTextarea
                          value={text}
                          onChange={(value) =>
                            updateArrayField("mainRotatingTexts", index, value)
                          }
                          rows={2}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() =>
                            removeArrayItem("mainRotatingTexts", index)
                          }
                          aria-label="Delete text"
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => addArrayItem("mainRotatingTexts", "")}
                      variant="outline"
                      borderColor={useColorModeValue("gray.700", "gray.300")}
                      color={useColorModeValue("gray.700", "gray.300")}
                      _hover={{
                        bg: useColorModeValue("gray.100", "gray.700"),
                      }}
                      size="sm"
                    >
                      Add Rotating Text
                    </Button>
                  </VStack>
                </FormControl>

                <Divider />

                <FormControl>
                  <FormLabel>Philippines Title</FormLabel>
                  <DebouncedInput
                    value={content.philippinesTitle || ""}
                    onChange={(value) => updateField("philippinesTitle", value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Philippines Description</FormLabel>
                  <DebouncedTextarea
                    value={content.philippinesDescription || ""}
                    onChange={(value) =>
                      updateField("philippinesDescription", value)
                    }
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Philippines Bible Verse</FormLabel>
                  <DebouncedTextarea
                    value={content.philippinesBibleVerse || ""}
                    onChange={(value) =>
                      updateField("philippinesBibleVerse", value)
                    }
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Mission & Values Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Mission & Values (Carousel)
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                {content.missionValues?.map((item, index) => (
                  <Card key={index} w="full" variant="outline">
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Card {index + 1}</Text>
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() =>
                            removeArrayItem("missionValues", index)
                          }
                          aria-label="Delete card"
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3}>
                        <FormControl>
                          <FormLabel>Title</FormLabel>
                          <DebouncedInput
                            value={item.title}
                            onChange={(value) =>
                              updateMissionValue(index, "title", value)
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <DebouncedTextarea
                            value={item.description}
                            onChange={(value) =>
                              updateMissionValue(index, "description", value)
                            }
                            rows={3}
                          />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={3} w="full">
                          <FormControl>
                            <FormLabel>Icon (Chakra Icon Name)</FormLabel>
                            <DebouncedInput
                              value={item.icon}
                              onChange={(value) =>
                                updateMissionValue(index, "icon", value)
                              }
                              placeholder="StarIcon"
                            />
                          </FormControl>
                          <ColorPicker
                            label="Color"
                            value={item.color}
                            onChange={(value) =>
                              updateMissionValue(index, "color", value)
                            }
                          />
                        </SimpleGrid>
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
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.700"),
                  }}
                >
                  Add Mission/Value Card
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Ministries Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Ministries Section
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                {content.ministries?.map((item, index) => (
                  <Card key={index} w="full" variant="outline">
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Ministry {index + 1}</Text>
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => removeArrayItem("ministries", index)}
                          aria-label="Delete ministry"
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3}>
                        <FormControl>
                          <FormLabel>Title</FormLabel>
                          <DebouncedInput
                            value={item.title}
                            onChange={(value) =>
                              updateMinistry(index, "title", value)
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <DebouncedTextarea
                            value={item.description}
                            onChange={(value) =>
                              updateMinistry(index, "description", value)
                            }
                            rows={2}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Icon</FormLabel>
                          <DebouncedInput
                            value={item.icon}
                            onChange={(value) =>
                              updateMinistry(index, "icon", value)
                            }
                            placeholder="MusicNote"
                          />
                        </FormControl>
                      </VStack>
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
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.700"),
                  }}
                >
                  Add Ministry
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Call to Action Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Call to Action Section
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>CTA Title</FormLabel>
                  <DebouncedInput
                    value={content.ctaTitle || ""}
                    onChange={(value) => updateField("ctaTitle", value)}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CTA Description</FormLabel>
                  <DebouncedTextarea
                    value={content.ctaDescription || ""}
                    onChange={(value) => updateField("ctaDescription", value)}
                    rows={2}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CTA Button Text</FormLabel>
                  <DebouncedInput
                    value={content.ctaButtonText || ""}
                    onChange={(value) => updateField("ctaButtonText", value)}
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Singers Section */}
          <AccordionItem
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            mb={4}
          >
            <AccordionButton bg={cardBg} _hover={{ bg: hoverBg }}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Worship Leaders / Singers Section
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Section Title</FormLabel>
                  <DebouncedInput
                    value={content.singersTitle || ""}
                    onChange={(value) => updateField("singersTitle", value)}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Section Description</FormLabel>
                  <DebouncedTextarea
                    value={content.singersDescription || ""}
                    onChange={(value) =>
                      updateField("singersDescription", value)
                    }
                    rows={2}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Singers</FormLabel>
                  <VStack spacing={4} align="stretch">
                    {content.singers?.map((singer, index) => (
                      <Card key={index} variant="outline">
                        <CardHeader>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Singer {index + 1}</Text>
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              size="sm"
                              onClick={() => removeArrayItem("singers", index)}
                              aria-label="Delete singer"
                            />
                          </HStack>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3}>
                            <FormControl>
                              <FormLabel>Name</FormLabel>
                              <DebouncedInput
                                value={singer.name}
                                onChange={(value) =>
                                  updateArrayField("singers", index, {
                                    ...singer,
                                    name: value,
                                  })
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Tagline</FormLabel>
                              <DebouncedTextarea
                                value={singer.tagline}
                                onChange={(value) =>
                                  updateArrayField("singers", index, {
                                    ...singer,
                                    tagline: value,
                                  })
                                }
                                rows={2}
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
                      _hover={{
                        bg: useColorModeValue("gray.100", "gray.700"),
                      }}
                    >
                      Add Singer
                    </Button>
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Bible Verse</FormLabel>
                  <DebouncedTextarea
                    value={content.singersBibleVerse || ""}
                    onChange={(value) =>
                      updateField("singersBibleVerse", value)
                    }
                    rows={2}
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Box
          position="sticky"
          bottom={0}
          bg={cardBg}
          p={4}
          borderTop="1px"
          borderColor={borderColor}
        >
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
            w="full"
          >
            Save All Changes
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
