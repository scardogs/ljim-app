import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  VStack,
  FormControl,
  FormLabel,
  Text,
  Divider,
  SimpleGrid,
  Heading,
  Button,
  IconButton,
  HStack,
  Badge,
  TabPanel,
  RadioGroup,
  Radio,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FiAward } from "react-icons/fi";
import ImprovedImageUpload from "../ImprovedImageUpload";
import VideoUpload from "../VideoUpload";
import ColorPicker from "../ColorPicker";
import DebouncedInput from "../DebouncedInput";
import DebouncedTextarea from "../DebouncedTextarea";

const SectionHeader = ({ icon, title, count }) => {
  const Icon = icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <Icon style={{ fontSize: "24px", color: "#718096" }} />
      <h3 style={{ fontSize: "18px", fontWeight: "600" }}>{title}</h3>
      {count !== undefined && (
        <Badge colorScheme="gray" fontSize="sm">
          {count} {count === 1 ? "item" : "items"}
        </Badge>
      )}
    </div>
  );
};

export default function MissionValuesTab({
  content,
  updateField,
  updateMissionValue,
  addArrayItem,
  removeArrayItem,
}) {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const cardHeaderBg = useColorModeValue("white", "gray.700");
  const addButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const addButtonColor = useColorModeValue("gray.700", "gray.300");
  const addButtonHoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <TabPanel px={{ base: 0, md: 4 }}>
      <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
        <CardBody p={{ base: 4, md: 8 }}>
          <SectionHeader
            icon={FiAward}
            title="Mission & Values Carousel"
            count={content.missionValues?.length}
          />
          <Text fontSize="sm" color="gray.500" mb={6}>
            These cards will appear in a rotating carousel on your homepage
          </Text>

          {/* Background Media Settings */}
          <Card
            variant="outline"
            borderWidth="2px"
            borderColor={borderColor}
            bg={sectionBg}
            mb={6}
          >
            <CardBody>
              <Heading size="sm" mb={4}>
                Background Media
              </Heading>
              <Text fontSize="xs" color="gray.500" mb={4}>
                Choose background for Mission & Values section with parallax
                effect
              </Text>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="semibold">Background Type</FormLabel>
                  <RadioGroup
                    value={content.missionValuesMediaType || "pattern"}
                    onChange={(value) =>
                      updateField("missionValuesMediaType", value)
                    }
                  >
                    <Stack direction="row" spacing={4} flexWrap="wrap">
                      <Radio value="pattern">Pattern (Default)</Radio>
                      <Radio value="image">Image</Radio>
                      <Radio value="video">Video</Radio>
                      <Radio value="gif">GIF</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {content.missionValuesMediaType === "image" ? (
                  <ImprovedImageUpload
                    label="Background Image"
                    value={content.missionValuesBackgroundImage || ""}
                    onChange={(value) =>
                      updateField("missionValuesBackgroundImage", value)
                    }
                    placeholder="Upload background image"
                    imageType="homepage/mission-values-bg"
                  />
                ) : (content.missionValuesMediaType === "video" ||
                    content.missionValuesMediaType === "gif") &&
                  content.missionValuesMediaType !== "pattern" ? (
                  <VideoUpload
                    label={`Background ${
                      content.missionValuesMediaType === "video"
                        ? "Video"
                        : "GIF"
                    }`}
                    value={content.missionValuesMediaUrl || ""}
                    onChange={(value) =>
                      updateField("missionValuesMediaUrl", value)
                    }
                    mediaType={content.missionValuesMediaType}
                    imageType="homepage/mission-values-bg"
                  />
                ) : null}

                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                  💡 The background will have a fixed parallax effect — it
                  stays in place while content scrolls over it
                </Text>
              </VStack>
            </CardBody>
          </Card>

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
                      <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
                        Card {index + 1}
                      </Badge>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        {item.title || "Untitled"}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("missionValues", index)}
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
  );
}

