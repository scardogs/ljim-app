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
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/fi";
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

export default function MinistriesTab({
  content,
  updateMinistry,
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
            icon={FiUsers}
            title="Ministries Section"
            count={content.ministries?.length}
          />
          <Text fontSize="sm" color="gray.500" mb={6}>
            Showcase your church ministries and programs
          </Text>

          <VStack spacing={4} align="stretch">
            {content.ministries?.map((item, index) => (
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
                        #{index + 1}
                      </Badge>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        {item.title || "Untitled Ministry"}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("ministries", index)}
                      aria-label="Delete ministry"
                    />
                  </HStack>
                </CardHeader>
                <CardBody p={{ base: 3, md: 6 }}>
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacing={{ base: 3, md: 4 }}
                  >
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Ministry Title
                      </FormLabel>
                      <DebouncedInput
                        value={item.title}
                        onChange={(value) =>
                          updateMinistry(index, "title", value)
                        }
                        placeholder="Worship Ministry"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Icon
                      </FormLabel>
                      <DebouncedInput
                        value={item.icon}
                        onChange={(value) => updateMinistry(index, "icon", value)}
                        placeholder="MusicNote"
                      />
                    </FormControl>
                    <FormControl gridColumn={{ base: "1", md: "1 / -1" }}>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Description
                      </FormLabel>
                      <DebouncedTextarea
                        value={item.description}
                        onChange={(value) =>
                          updateMinistry(index, "description", value)
                        }
                        rows={2}
                        placeholder="Leading believers into the presence of God..."
                      />
                    </FormControl>
                  </SimpleGrid>
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
              borderColor={addButtonBorderColor}
              color={addButtonColor}
              _hover={{ bg: addButtonHoverBg }}
              size="lg"
            >
              Add New Ministry
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </TabPanel>
  );
}

