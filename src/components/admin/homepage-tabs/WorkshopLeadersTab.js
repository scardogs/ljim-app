import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  VStack,
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Box,
  Button,
  IconButton,
  HStack,
  Badge,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FiMusic } from "react-icons/fi";
import ImprovedImageUpload from "../ImprovedImageUpload";
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

export default function WorkshopLeadersTab({
  content,
  updateField,
  updateArrayField,
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
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Section Info */}
        <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
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
                <FormLabel fontWeight="semibold">Section Description</FormLabel>
                <DebouncedTextarea
                  value={content.singersDescription || ""}
                  onChange={(value) => updateField("singersDescription", value)}
                  rows={2}
                  placeholder="Voices united in harmony..."
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Bible Verse</FormLabel>
                <DebouncedTextarea
                  value={content.singersBibleVerse || ""}
                  onChange={(value) => updateField("singersBibleVerse", value)}
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
                      <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
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
  );
}

