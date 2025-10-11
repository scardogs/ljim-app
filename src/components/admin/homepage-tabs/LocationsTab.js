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
  Button,
  IconButton,
  HStack,
  Badge,
  Select,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FiMapPin } from "react-icons/fi";
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

export default function LocationsTab({
  content,
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
      <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
        <CardBody p={{ base: 4, md: 8 }}>
          <SectionHeader
            icon={FiMapPin}
            title="Church Locations"
            count={content.regionalChurches?.length}
          />
          <Text fontSize="sm" color="gray.500" mb={6}>
            Add churches in different regions (Luzon, Visayas, Mindanao)
          </Text>

          <VStack spacing={4} align="stretch">
            {content.regionalChurches?.map((church, index) => (
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
                      <Badge
                        colorScheme={
                          church.region === "Luzon"
                            ? "blue"
                            : church.region === "Visayas"
                            ? "green"
                            : "purple"
                        }
                        fontSize="md"
                        px={3}
                        py={1}
                      >
                        {church.region || "Unknown"}
                      </Badge>
                      <Text fontWeight="bold">
                        {church.churchName || "Untitled Church"}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeArrayItem("regionalChurches", index)
                      }
                      aria-label="Delete church"
                    />
                  </HStack>
                </CardHeader>
                <CardBody p={{ base: 3, md: 4 }}>
                  <VStack spacing={{ base: 3, md: 4 }}>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={{ base: 3, md: 4 }}
                      w="full"
                    >
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          Region
                        </FormLabel>
                        <Select
                          value={church.region || "Luzon"}
                          onChange={(e) =>
                            updateArrayField("regionalChurches", index, {
                              ...church,
                              region: e.target.value,
                            })
                          }
                        >
                          <option value="Luzon">Luzon</option>
                          <option value="Visayas">Visayas</option>
                          <option value="Mindanao">Mindanao</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          Church Name
                        </FormLabel>
                        <DebouncedInput
                          value={church.churchName}
                          onChange={(value) =>
                            updateArrayField("regionalChurches", index, {
                              ...church,
                              churchName: value,
                            })
                          }
                          placeholder="LJIM Manila"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Address
                      </FormLabel>
                      <DebouncedTextarea
                        value={church.address}
                        onChange={(value) =>
                          updateArrayField("regionalChurches", index, {
                            ...church,
                            address: value,
                          })
                        }
                        rows={2}
                        placeholder="123 Main Street, Manila, Philippines"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Description
                      </FormLabel>
                      <DebouncedTextarea
                        value={church.description}
                        onChange={(value) =>
                          updateArrayField("regionalChurches", index, {
                            ...church,
                            description: value,
                          })
                        }
                        rows={2}
                        placeholder="Brief description of the church..."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Contact Info
                      </FormLabel>
                      <DebouncedInput
                        value={church.contactInfo}
                        onChange={(value) =>
                          updateArrayField("regionalChurches", index, {
                            ...church,
                            contactInfo: value,
                          })
                        }
                        placeholder="+63 123 456 7890 or email@church.com"
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            ))}

            <Button
              leftIcon={<AddIcon />}
              onClick={() =>
                addArrayItem("regionalChurches", {
                  region: "Luzon",
                  churchName: "",
                  address: "",
                  description: "",
                  contactInfo: "",
                })
              }
              variant="outline"
              borderColor={addButtonBorderColor}
              color={addButtonColor}
              _hover={{ bg: addButtonHoverBg }}
              size="lg"
              w="full"
            >
              Add New Church Location
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </TabPanel>
  );
}

