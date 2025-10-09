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
  Spinner,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Divider,
  IconButton,
  HStack,
  Badge,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaBook, FaSave } from "react-icons/fa";

const BibleSettingsEditor = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

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
          title: "Settings saved!",
          description: "Bible settings updated successfully",
          status: "success",
          duration: 3000,
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Failed to update Bible settings",
        status: "error",
        duration: 3000,
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
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading Bible settings...</Text>
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
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack spacing={3}>
          <FaBook size={32} color="#667eea" />
          <Heading size="lg">Bible Settings</Heading>
        </HStack>

        <Text color="gray.600">
          Configure Bible verse features, translations, and display settings
        </Text>

        <Accordion defaultIndex={[0]} allowMultiple>
          {/* Page Content Settings */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="md">Page Content</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Page Title</FormLabel>
                  <Input
                    value={settings.pageContent?.pageTitle || ""}
                    onChange={(e) =>
                      updatePageContent("pageTitle", e.target.value)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Page Subtitle</FormLabel>
                  <Input
                    value={settings.pageContent?.pageSubtitle || ""}
                    onChange={(e) =>
                      updatePageContent("pageSubtitle", e.target.value)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Verse of the Day Title</FormLabel>
                  <Input
                    value={settings.pageContent?.verseOfTheDayTitle || ""}
                    onChange={(e) =>
                      updatePageContent("verseOfTheDayTitle", e.target.value)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Search Section Title</FormLabel>
                  <Input
                    value={settings.pageContent?.searchSectionTitle || ""}
                    onChange={(e) =>
                      updatePageContent("searchSectionTitle", e.target.value)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Search Placeholder</FormLabel>
                  <Input
                    value={settings.pageContent?.searchPlaceholder || ""}
                    onChange={(e) =>
                      updatePageContent("searchPlaceholder", e.target.value)
                    }
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Display Settings */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="md">Display Settings</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Default Translation</FormLabel>
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
                    <option value="oeb-us">Open English Bible (OEB-US)</option>
                    <option value="clementine">Clementine Latin Vulgate</option>
                    <option value="almeida">João Ferreira de Almeida</option>
                    <option value="rccv">
                      Romanian Corrected Cornilescu Version
                    </option>
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Show Verse of the Day</FormLabel>
                  <Switch
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
                  <FormLabel mb="0">Show Bible Page Link</FormLabel>
                  <Switch
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
                  <FormLabel mb="0">Enable Share Feature</FormLabel>
                  <Switch
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
                  <FormLabel mb="0">Enable Copy Feature</FormLabel>
                  <Switch
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
                  <FormLabel mb="0">Compact Mode</FormLabel>
                  <Switch
                    isChecked={settings.displaySettings?.compactMode}
                    onChange={(e) =>
                      updateDisplaySetting("compactMode", e.target.checked)
                    }
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Featured Verses */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="md">Featured Verses</Heading>
                <Text fontSize="sm" color="gray.600">
                  Verses used for daily rotation
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={4} align="stretch">
                {settings.featuredVerses?.map((verse, index) => (
                  <Card key={index} variant="outline">
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Reference</FormLabel>
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
                          <FormLabel fontSize="sm">Translation</FormLabel>
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
                          <FormLabel fontSize="sm">Category</FormLabel>
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

                        <FormControl
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FormLabel fontSize="sm" mb="0">
                            Enabled
                          </FormLabel>
                          <HStack>
                            <Switch
                              isChecked={verse.enabled}
                              onChange={(e) =>
                                updateFeaturedVerse(
                                  index,
                                  "enabled",
                                  e.target.checked
                                )
                              }
                            />
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
                        </FormControl>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                ))}

                <Button
                  leftIcon={<AddIcon />}
                  onClick={addFeaturedVerse}
                  colorScheme="purple"
                  variant="outline"
                >
                  Add Featured Verse
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Quick Searches */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="md">Quick Searches</Heading>
                <Text fontSize="sm" color="gray.600">
                  Popular verse shortcuts for users
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                {settings.quickSearches?.map((search, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder="e.g., John 3:16"
                      value={search}
                      onChange={(e) => updateQuickSearch(index, e.target.value)}
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
                  colorScheme="purple"
                  variant="outline"
                >
                  Add Quick Search
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Save Button */}
        <Flex
          justify="flex-end"
          position="sticky"
          bottom={0}
          bg="white"
          py={4}
          zIndex={1}
        >
          <Button
            leftIcon={<FaSave />}
            colorScheme="purple"
            size="lg"
            onClick={handleSave}
            isLoading={saving}
          >
            Save Settings
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default BibleSettingsEditor;
