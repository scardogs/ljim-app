import React from "react";
import {
  Card,
  CardBody,
  VStack,
  FormControl,
  FormLabel,
  Text,
  Divider,
  SimpleGrid,
  Heading,
  Box,
  Button,
  IconButton,
  HStack,
  Badge,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FiFileText } from "react-icons/fi";
import ImprovedImageUpload from "../ImprovedImageUpload";
import DebouncedInput from "../DebouncedInput";
import DebouncedTextarea from "../DebouncedTextarea";

const SectionHeader = ({ icon, title }) => {
  const Icon = icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <Icon style={{ fontSize: "24px", color: "#718096" }} />
      <h3 style={{ fontSize: "18px", fontWeight: "600" }}>{title}</h3>
    </div>
  );
};

export default function MainContentTab({
  content,
  updateField,
  updateArrayField,
  addArrayItem,
  removeArrayItem,
}) {
  const cardBg = useColorModeValue("white", "gray.700");
  const addButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const addButtonColor = useColorModeValue("gray.700", "gray.300");
  const addButtonHoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <TabPanel px={{ base: 0, md: 4 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Main Title */}
        <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
          <CardBody p={{ base: 4, md: 8 }}>
            <SectionHeader icon={FiFileText} title="Main Content Section" />
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
                <FormLabel fontWeight="semibold">Rotating Text Messages</FormLabel>
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
                              updateArrayField("mainRotatingTexts", index, value)
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
                    _hover={{ bg: addButtonHoverBg }}
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
        <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
          <CardBody p={{ base: 4, md: 8 }}>
            <Heading size="sm" mb={4}>
              Philippines Section
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Section Title</FormLabel>
                <DebouncedInput
                  value={content.philippinesTitle || ""}
                  onChange={(value) => updateField("philippinesTitle", value)}
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
  );
}

