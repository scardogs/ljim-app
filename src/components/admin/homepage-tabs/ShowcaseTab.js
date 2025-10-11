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
import { FiStar } from "react-icons/fi";
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

export default function ShowcaseTab({
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
              icon={FiStar}
              title="Showcase Section"
              count={content.showcaseItems?.length}
            />
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Section Title</FormLabel>
                <DebouncedInput
                  value={content.showcaseTitle || ""}
                  onChange={(value) => updateField("showcaseTitle", value)}
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
                      <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
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
                      onClick={() => removeArrayItem("showcaseItems", index)}
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
  );
}

