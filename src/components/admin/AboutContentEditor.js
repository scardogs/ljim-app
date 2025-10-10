import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Card,
  CardBody,
  Spinner,
  Center,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FiUser, FiFileText, FiBookOpen } from "react-icons/fi";
import ImprovedImageUpload from "./ImprovedImageUpload";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function AboutContentEditor() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  const fetchContent = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/about");
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load about content",
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
      const response = await fetch("/api/admin/about", {
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
          description: "About content updated successfully",
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
        description: "Failed to save about content",
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

  const SectionHeader = ({ icon, title }) => (
    <Flex align="center" gap={3} mb={4}>
      <Icon as={icon} boxSize={6} color="gray.600" />
      <Heading size="md">{title}</Heading>
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
          <Heading size={{ base: "md", md: "lg" }}>About Page Content</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Edit all content for the About page
          </Text>
        </VStack>
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
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

      <VStack spacing={{ base: 4, md: 6 }} px={{ base: 2, md: 6 }}>
        {/* Founder Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiUser} title="Founder Section" />
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Founder Name</FormLabel>
                  <DebouncedInput
                    value={content.founderName || ""}
                    onChange={(value) => updateField("founderName", value)}
                    size="lg"
                    placeholder="Bishop Ed Dalisay Fernandez"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold">Founder Title</FormLabel>
                  <DebouncedInput
                    value={content.founderTitle || ""}
                    onChange={(value) => updateField("founderTitle", value)}
                    size="lg"
                    placeholder="Founder & Spiritual Leader"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontWeight="semibold">Founder Biography</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Brief biography of the founder
                </Text>
                <DebouncedTextarea
                  value={content.founderBio || ""}
                  onChange={(value) => updateField("founderBio", value)}
                  rows={5}
                  placeholder="Bishop Ed Dalisay Fernandez is the founder..."
                />
              </FormControl>

              <ImprovedImageUpload
                label="Founder Photo"
                value={content.founderImage || ""}
                onChange={(value) => updateField("founderImage", value)}
                placeholder="/images/founder.jpg"
                imageType="about/founder"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Main About Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiFileText} title="Main About Section" />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">About Title</FormLabel>
                <DebouncedInput
                  value={content.aboutTitle || ""}
                  onChange={(value) => updateField("aboutTitle", value)}
                  size="lg"
                  placeholder="About LJIM"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">About Description</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Main description of your ministry
                </Text>
                <DebouncedTextarea
                  value={content.aboutDescription || ""}
                  onChange={(value) => updateField("aboutDescription", value)}
                  rows={3}
                  placeholder="Lift Jesus International Ministries is a Christ-centered..."
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Four Info Cards */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius={{ base: "lg", md: "xl" }}
          w="full"
        >
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiBookOpen} title="Information Cards" />
            <Text fontSize="sm" color="gray.500" mb={6}>
              These four cards appear in a grid layout on the About page
            </Text>

            <VStack spacing={6} align="stretch">
              {/* Our Story */}
              <Card variant="outline" bg={sectionBg} borderWidth="2px">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Heading size="sm" mb={4} color="gray.600">
                    Card 1: Our Story
                  </Heading>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Title
                      </FormLabel>
                      <DebouncedInput
                        value={content.storyTitle || ""}
                        onChange={(value) => updateField("storyTitle", value)}
                        placeholder="Our Story"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Content
                      </FormLabel>
                      <DebouncedTextarea
                        value={content.storyContent || ""}
                        onChange={(value) => updateField("storyContent", value)}
                        rows={3}
                        placeholder="Founded to uplift communities..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Our Mission */}
              <Card variant="outline" bg={sectionBg} borderWidth="2px">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Heading size="sm" mb={4} color="gray.600">
                    Card 2: Our Mission
                  </Heading>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Title
                      </FormLabel>
                      <DebouncedInput
                        value={content.missionTitle || ""}
                        onChange={(value) => updateField("missionTitle", value)}
                        placeholder="Our Mission"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Content
                      </FormLabel>
                      <DebouncedTextarea
                        value={content.missionContent || ""}
                        onChange={(value) =>
                          updateField("missionContent", value)
                        }
                        rows={3}
                        placeholder="To bring spiritual transformation..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Our Vision */}
              <Card variant="outline" bg={sectionBg} borderWidth="2px">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Heading size="sm" mb={4} color="gray.600">
                    Card 3: Our Vision
                  </Heading>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Title
                      </FormLabel>
                      <DebouncedInput
                        value={content.visionTitle || ""}
                        onChange={(value) => updateField("visionTitle", value)}
                        placeholder="Our Vision"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Content
                      </FormLabel>
                      <DebouncedTextarea
                        value={content.visionContent || ""}
                        onChange={(value) =>
                          updateField("visionContent", value)
                        }
                        rows={3}
                        placeholder="A world transformed by the Gospel..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Core Values */}
              <Card variant="outline" bg={sectionBg} borderWidth="2px">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Heading size="sm" mb={4} color="gray.600">
                    Card 4: Core Values
                  </Heading>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Title
                      </FormLabel>
                      <DebouncedInput
                        value={content.valuesTitle || ""}
                        onChange={(value) => updateField("valuesTitle", value)}
                        placeholder="Core Values"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Content
                      </FormLabel>
                      <DebouncedTextarea
                        value={content.valuesContent || ""}
                        onChange={(value) =>
                          updateField("valuesContent", value)
                        }
                        rows={3}
                        placeholder="Faith, community, service..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Floating Save Button (Mobile) */}
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
