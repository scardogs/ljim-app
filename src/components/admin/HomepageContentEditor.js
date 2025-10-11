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
  FiCrosshair,
} from "react-icons/fi";
import ImprovedImageUpload from "./ImprovedImageUpload";
import VideoUpload from "./VideoUpload";
import ColorPicker from "./ColorPicker";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

// Import modular tab components
import HeroTab from "./homepage-tabs/HeroTab";
import MainContentTab from "./homepage-tabs/MainContentTab";
import MissionValuesTab from "./homepage-tabs/MissionValuesTab";
import MinistriesTab from "./homepage-tabs/MinistriesTab";
import CTATab from "./homepage-tabs/CTATab";
import WorkshopLeadersTab from "./homepage-tabs/WorkshopLeadersTab";
import CrossTab from "./homepage-tabs/CrossTab";
import CongregationGalleryTab from "./homepage-tabs/CongregationGalleryTab";
import ShowcaseTab from "./homepage-tabs/ShowcaseTab";
import LocationsTab from "./homepage-tabs/LocationsTab";

export default function HomepageContentEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState(new Set([0])); // Track which tabs have been loaded
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

  // Tab sections mapping
  const tabSections = {
    0: [
      "heroTitle",
      "heroSubtitle",
      "heroButtonText",
      "heroImage",
      "heroMediaType",
      "heroVideoUrl",
    ],
    1: [
      "mainTitle",
      "mainRotatingTexts",
      "philippinesTitle",
      "philippinesDescription",
      "philippinesBibleVerse",
      "philippinesMapImageLight",
      "philippinesMapImageDark",
    ],
    2: [
      "missionValues",
      "missionValuesMediaType",
      "missionValuesMediaUrl",
      "missionValuesBackgroundImage",
    ],
    3: ["ministries"],
    4: ["ctaTitle", "ctaDescription", "ctaButtonText"],
    5: ["singersTitle", "singersDescription", "singers", "singersBibleVerse"],
    6: ["crossSectionVerse"],
    7: [
      "congregationTitle",
      "congregationDescription",
      "congregationPhotos",
      "congregationBibleVerse",
    ],
    8: ["showcaseTitle", "showcaseDescription", "showcaseItems"],
    9: ["regionalChurches"],
  };

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

  // Handle tab change - mark tab as loaded
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (!loadedTabs.has(index)) {
      setLoadedTabs(new Set([...loadedTabs, index]));
    }
  };

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

  // Lazy load tab content - only render if tab has been visited
  const LazyTabPanel = ({ tabIndex, children }) => {
    if (!loadedTabs.has(tabIndex)) {
      return (
        <TabPanel px={{ base: 0, md: 4 }}>
          <Center p={10}>
            <VStack spacing={4}>
              <Spinner size="lg" color="gray.600" thickness="3px" />
              <Text color="gray.500">Loading section...</Text>
            </VStack>
          </Center>
        </TabPanel>
      );
    }
    return children;
  };

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

      <Tabs
        variant="soft-rounded"
        colorScheme="gray"
        px={{ base: 2, md: 6 }}
        index={activeTab}
        onChange={handleTabChange}
      >
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
              as={FiCrosshair}
              mr={{ base: 1, md: 2 }}
              boxSize={{ base: 3, md: 4 }}
            />
            <Text display={{ base: "none", sm: "inline" }}>Cross</Text>
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
          <LazyTabPanel tabIndex={0}>
            <HeroTab content={content} updateField={updateField} />
          </LazyTabPanel>

          {/* Main Content Tab */}
          <LazyTabPanel tabIndex={1}>
            <MainContentTab
              content={content}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Mission & Values Tab */}
          <LazyTabPanel tabIndex={2}>
            <MissionValuesTab
              content={content}
              updateField={updateField}
              updateMissionValue={updateMissionValue}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Ministries Tab */}
          <LazyTabPanel tabIndex={3}>
            <MinistriesTab
              content={content}
              updateMinistry={updateMinistry}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Call to Action Tab */}
          <LazyTabPanel tabIndex={4}>
            <CTATab content={content} updateField={updateField} />
          </LazyTabPanel>

          {/* Worship Leaders Tab */}
          <LazyTabPanel tabIndex={5}>
            <WorkshopLeadersTab
              content={content}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Glowing Cross Section Tab */}
          <LazyTabPanel tabIndex={6}>
            <CrossTab content={content} updateField={updateField} />
          </LazyTabPanel>

          {/* Congregation Gallery Tab */}
          <LazyTabPanel tabIndex={7}>
            <CongregationGalleryTab
              content={content}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Showcase Section Tab */}
          <LazyTabPanel tabIndex={8}>
            <ShowcaseTab
              content={content}
              updateField={updateField}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>

          {/* Regional Churches (Locations) Tab */}
          <LazyTabPanel tabIndex={9}>
            <LocationsTab
              content={content}
              updateArrayField={updateArrayField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </LazyTabPanel>
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
