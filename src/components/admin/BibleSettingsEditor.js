/**
 * Bible Settings Editor Component
 * Admin interface for managing Bible feature settings
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  useToast,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Switch,
  Select,
  IconButton,
  HStack,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Tooltip,
  useColorModeValue,
  Icon,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FaBook, FaSave, FaCog, FaList, FaSearch } from "react-icons/fa";
import { FiBook, FiSettings, FiStar, FiSearch } from "react-icons/fi";
import ChurchLoader from "../ChurchLoader";

// Section Header Component
const SectionHeader = ({ icon, title, subtitle }) => {
  const iconColor = useColorModeValue("gray.700", "gray.300");
  const titleColor = useColorModeValue("gray.900", "gray.100");
  const subtitleColor = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack align="start" spacing={2} mb={4}>
      <HStack spacing={3}>
        <Icon as={icon} boxSize={6} color={iconColor} />
        <Heading size="md" color={titleColor}>
          {title}
        </Heading>
      </HStack>
      {subtitle && (
        <Text fontSize="sm" color={subtitleColor}>
          {subtitle}
        </Text>
      )}
    </VStack>
  );
};

const BibleSettingsEditor = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");
  const addButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const addButtonColor = useColorModeValue("gray.700", "gray.300");
  const addButtonHoverBg = useColorModeValue("gray.100", "gray.700");
  const cardHeaderBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/bible-settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error loading settings",
        description: "Failed to load Bible settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/bible-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Bible settings updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to update Bible settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePageContent = (field, value) => {
    setSettings({
      ...settings,
      pageContent: {
        ...settings.pageContent,
        [field]: value,
      },
    });
  };

  const updateDisplaySetting = (field, value) => {
    setSettings({
      ...settings,
      displaySettings: {
        ...settings.displaySettings,
        [field]: value,
      },
    });
  };

  const addFeaturedVerse = () => {
    setSettings({
      ...settings,
      featuredVerses: [
        ...settings.featuredVerses,
        {
          reference: "",
          translation: "kjv",
          category: "inspirational",
          enabled: true,
        },
      ],
    });
  };

  const updateFeaturedVerse = (index, field, value) => {
    const newVerses = [...settings.featuredVerses];
    newVerses[index][field] = value;
    setSettings({
      ...settings,
      featuredVerses: newVerses,
    });
  };

  const removeFeaturedVerse = (index) => {
    setSettings({
      ...settings,
      featuredVerses: settings.featuredVerses.filter((_, i) => i !== index),
    });
  };

  const addQuickSearch = () => {
    setSettings({
      ...settings,
      quickSearches: [...settings.quickSearches, ""],
    });
  };

  const updateQuickSearch = (index, value) => {
    const newSearches = [...settings.quickSearches];
    newSearches[index] = value;
    setSettings({
      ...settings,
      quickSearches: newSearches,
    });
  };

  const removeQuickSearch = (index) => {
    setSettings({
      ...settings,
      quickSearches: settings.quickSearches.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <Box
        minH="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <ChurchLoader message="Loading Bible settings..." />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Failed to load settings</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Save Button */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        p={4}
        bg={headerBg}
        borderRadius="lg"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <Icon as={FaBook} boxSize={8} color={addButtonColor} />
          <VStack align="start" spacing={0}>
            <Heading size="lg">Bible Settings</Heading>
            <Text fontSize="sm" color="gray.500">
              Configure Bible features and translations
            </Text>
          </VStack>
        </HStack>
        <Button
          leftIcon={<FaSave />}
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          size="lg"
          onClick={handleSave}
          isLoading={saving}
          loadingText="Saving..."
        >
          Save Changes
        </Button>
      </Flex>

      {/* Tabs */}
      <Tabs colorScheme="gray" variant="enclosed">
        <TabList>
          <Tab>
            <Icon as={FiBook} mr={2} />
            Page Content
          </Tab>
          <Tab>
            <Icon as={FiSettings} mr={2} />
            Display Settings
          </Tab>
          <Tab>
            <Icon as={FiStar} mr={2} />
            Featured Verses
          </Tab>
          <Tab>
            <Icon as={FiSearch} mr={2} />
            Quick Searches
          </Tab>
        </TabList>

        <TabPanels>
          {/* Page Content Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card bg={cardBg} shadow="sm">
              <CardBody>
                <SectionHeader
                  icon={FiBook}
                  title="Page Content"
                  subtitle="Customize the Bible page titles and text"
                />

                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold">Page Title</FormLabel>
                    <Input
                      value={settings.pageContent?.pageTitle || ""}
                      onChange={(e) =>
                        updatePageContent("pageTitle", e.target.value)
                      }
                      placeholder="The Holy Bible"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold">Page Subtitle</FormLabel>
                    <Input
                      value={settings.pageContent?.pageSubtitle || ""}
                      onChange={(e) =>
                        updatePageContent("pageSubtitle", e.target.value)
                      }
                      placeholder="Explore God's Word"
                    />
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel fontWeight="semibold">
                      Verse of the Day Title
                    </FormLabel>
                    <Input
                      value={settings.pageContent?.verseOfTheDayTitle || ""}
                      onChange={(e) =>
                        updatePageContent("verseOfTheDayTitle", e.target.value)
                      }
                      placeholder="Verse of the Day"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold">
                      Search Section Title
                    </FormLabel>
                    <Input
                      value={settings.pageContent?.searchSectionTitle || ""}
                      onChange={(e) =>
                        updatePageContent("searchSectionTitle", e.target.value)
                      }
                      placeholder="Search the Bible"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold">
                      Search Placeholder
                    </FormLabel>
                    <Input
                      value={settings.pageContent?.searchPlaceholder || ""}
                      onChange={(e) =>
                        updatePageContent("searchPlaceholder", e.target.value)
                      }
                      placeholder="Enter verse reference..."
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Display Settings Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card bg={cardBg} shadow="sm">
              <CardBody>
                <SectionHeader
                  icon={FiSettings}
                  title="Display Settings"
                  subtitle="Configure how Bible features are displayed"
                />

                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold">
                      Default Translation
                    </FormLabel>
                    <Select
                      value={settings.defaultTranslation || "kjv"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultTranslation: e.target.value,
                        })
                      }
                    >
                      <option value="kjv">King James Version (KJV)</option>
                      <option value="web">World English Bible (WEB)</option>
                      <option value="oeb-us">
                        Open English Bible (OEB-US)
                      </option>
                      <option value="clementine">
                        Clementine Latin Vulgate
                      </option>
                      <option value="almeida">João Ferreira de Almeida</option>
                      <option value="rccv">
                        Romanian Corrected Cornilescu Version
                      </option>
                    </Select>
                  </FormControl>

                  <Divider />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0" flex="1" fontWeight="semibold">
                        Show Verse of the Day
                      </FormLabel>
                      <Switch
                        colorScheme="gray"
                        size="lg"
                        isChecked={settings.displaySettings?.showVerseOfTheDay}
                        onChange={(e) =>
                          updateDisplaySetting(
                            "showVerseOfTheDay",
                            e.target.checked
                          )
                        }
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0" flex="1" fontWeight="semibold">
                        Show Bible Page Link
                      </FormLabel>
                      <Switch
                        colorScheme="gray"
                        size="lg"
                        isChecked={settings.displaySettings?.showBiblePageLink}
                        onChange={(e) =>
                          updateDisplaySetting(
                            "showBiblePageLink",
                            e.target.checked
                          )
                        }
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0" flex="1" fontWeight="semibold">
                        Enable Share Feature
                      </FormLabel>
                      <Switch
                        colorScheme="gray"
                        size="lg"
                        isChecked={settings.displaySettings?.enableShareFeature}
                        onChange={(e) =>
                          updateDisplaySetting(
                            "enableShareFeature",
                            e.target.checked
                          )
                        }
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0" flex="1" fontWeight="semibold">
                        Enable Copy Feature
                      </FormLabel>
                      <Switch
                        colorScheme="gray"
                        size="lg"
                        isChecked={settings.displaySettings?.enableCopyFeature}
                        onChange={(e) =>
                          updateDisplaySetting(
                            "enableCopyFeature",
                            e.target.checked
                          )
                        }
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0" flex="1" fontWeight="semibold">
                        Compact Mode
                      </FormLabel>
                      <Switch
                        colorScheme="gray"
                        size="lg"
                        isChecked={settings.displaySettings?.compactMode}
                        onChange={(e) =>
                          updateDisplaySetting("compactMode", e.target.checked)
                        }
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Featured Verses Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <VStack spacing={4} align="stretch">
              <Card bg={cardBg} shadow="sm">
                <CardHeader bg={cardHeaderBg}>
                  <SectionHeader
                    icon={FiStar}
                    title="Featured Verses"
                    subtitle="Manage verses for daily rotation and special displays"
                  />
                </CardHeader>
              </Card>

              {settings.featuredVerses?.map((verse, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="sm"
                  _hover={{ shadow: "md", borderColor: addButtonColor }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Badge colorScheme="gray" fontSize="sm">
                          Verse #{index + 1}
                        </Badge>
                        <HStack>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            w="auto"
                          >
                            <FormLabel fontSize="sm" mb="0" mr={2}>
                              Enabled
                            </FormLabel>
                            <Switch
                              colorScheme="gray"
                              isChecked={verse.enabled}
                              onChange={(e) =>
                                updateFeaturedVerse(
                                  index,
                                  "enabled",
                                  e.target.checked
                                )
                              }
                            />
                          </FormControl>
                          <Tooltip label="Remove verse">
                            <IconButton
                              icon={<DeleteIcon />}
                              onClick={() => removeFeaturedVerse(index)}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              aria-label="Remove verse"
                            />
                          </Tooltip>
                        </HStack>
                      </Flex>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold">
                            Reference
                          </FormLabel>
                          <Input
                            placeholder="e.g., John 3:16"
                            value={verse.reference}
                            onChange={(e) =>
                              updateFeaturedVerse(
                                index,
                                "reference",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold">
                            Translation
                          </FormLabel>
                          <Select
                            value={verse.translation}
                            onChange={(e) =>
                              updateFeaturedVerse(
                                index,
                                "translation",
                                e.target.value
                              )
                            }
                          >
                            <option value="kjv">KJV</option>
                            <option value="web">WEB</option>
                            <option value="oeb-us">OEB-US</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold">
                            Category
                          </FormLabel>
                          <Select
                            value={verse.category}
                            onChange={(e) =>
                              updateFeaturedVerse(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                          >
                            <option value="inspirational">Inspirational</option>
                            <option value="comfort">Comfort</option>
                            <option value="guidance">Guidance</option>
                            <option value="faith">Faith</option>
                            <option value="love">Love</option>
                            <option value="hope">Hope</option>
                            <option value="peace">Peace</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              ))}

              <Button
                leftIcon={<AddIcon />}
                onClick={addFeaturedVerse}
                variant="outline"
                borderColor={addButtonBorderColor}
                color={addButtonColor}
                _hover={{ bg: addButtonHoverBg }}
                size="lg"
                w="full"
              >
                Add Featured Verse
              </Button>
            </VStack>
          </TabPanel>

          {/* Quick Searches Tab */}
          <TabPanel px={{ base: 0, md: 4 }}>
            <Card bg={cardBg} shadow="sm">
              <CardBody>
                <SectionHeader
                  icon={FiSearch}
                  title="Quick Searches"
                  subtitle="Popular verse shortcuts for easy access"
                />

                <VStack spacing={3} align="stretch">
                  {settings.quickSearches?.map((search, index) => (
                    <HStack key={index}>
                      <Input
                        placeholder="e.g., John 3:16"
                        value={search}
                        onChange={(e) =>
                          updateQuickSearch(index, e.target.value)
                        }
                        flex="1"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => removeQuickSearch(index)}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove search"
                      />
                    </HStack>
                  ))}

                  <Button
                    leftIcon={<AddIcon />}
                    onClick={addQuickSearch}
                    variant="outline"
                    borderColor={addButtonBorderColor}
                    color={addButtonColor}
                    _hover={{ bg: addButtonHoverBg }}
                    size="lg"
                    mt={2}
                  >
                    Add Quick Search
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BibleSettingsEditor;
