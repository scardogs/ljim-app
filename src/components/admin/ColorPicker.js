import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const CHAKRA_COLORS = {
  gray: [
    "gray.50",
    "gray.100",
    "gray.200",
    "gray.300",
    "gray.400",
    "gray.500",
    "gray.600",
    "gray.700",
    "gray.800",
    "gray.900",
  ],
  red: [
    "red.100",
    "red.200",
    "red.300",
    "red.400",
    "red.500",
    "red.600",
    "red.700",
    "red.800",
    "red.900",
  ],
  orange: [
    "orange.100",
    "orange.200",
    "orange.300",
    "orange.400",
    "orange.500",
    "orange.600",
    "orange.700",
    "orange.800",
    "orange.900",
  ],
  yellow: [
    "yellow.100",
    "yellow.200",
    "yellow.300",
    "yellow.400",
    "yellow.500",
    "yellow.600",
    "yellow.700",
    "yellow.800",
    "yellow.900",
  ],
  green: [
    "green.100",
    "green.200",
    "green.300",
    "green.400",
    "green.500",
    "green.600",
    "green.700",
    "green.800",
    "green.900",
  ],
  teal: [
    "teal.100",
    "teal.200",
    "teal.300",
    "teal.400",
    "teal.500",
    "teal.600",
    "teal.700",
    "teal.800",
    "teal.900",
  ],
  blue: [
    "blue.100",
    "blue.200",
    "blue.300",
    "blue.400",
    "blue.500",
    "blue.600",
    "blue.700",
    "blue.800",
    "blue.900",
  ],
  cyan: [
    "cyan.100",
    "cyan.200",
    "cyan.300",
    "cyan.400",
    "cyan.500",
    "cyan.600",
    "cyan.700",
    "cyan.800",
    "cyan.900",
  ],
  purple: [
    "purple.100",
    "purple.200",
    "purple.300",
    "purple.400",
    "purple.500",
    "purple.600",
    "purple.700",
    "purple.800",
    "purple.900",
  ],
  pink: [
    "pink.100",
    "pink.200",
    "pink.300",
    "pink.400",
    "pink.500",
    "pink.600",
    "pink.700",
    "pink.800",
    "pink.900",
  ],
};

const PRESET_HEX_COLORS = [
  "#000000",
  "#1A202C",
  "#2D3748",
  "#4A5568",
  "#718096",
  "#E53E3E",
  "#F56565",
  "#FC8181",
  "#FEB2B2",
  "#DD6B20",
  "#ED8936",
  "#F6AD55",
  "#FBD38D",
  "#D69E2E",
  "#ECC94B",
  "#F6E05E",
  "#FAF089",
  "#38A169",
  "#48BB78",
  "#68D391",
  "#9AE6B4",
  "#319795",
  "#38B2AC",
  "#4FD1C5",
  "#81E6D9",
  "#3182CE",
  "#4299E1",
  "#63B3ED",
  "#90CDF4",
  "#5A67D8",
  "#667EEA",
  "#7F9CF5",
  "#A3BFFA",
  "#805AD5",
  "#9F7AEA",
  "#B794F4",
  "#D6BCFA",
  "#D53F8C",
  "#ED64A6",
  "#F687B3",
  "#FBB6CE",
];

export default function ColorPicker({ label, value, onChange }) {
  const [hexInput, setHexInput] = useState("");
  const [grayShade, setGrayShade] = useState(7); // Default gray.700

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  // Extract current color type
  const isGrayColor = value?.startsWith("gray.");
  const isHexColor = value?.startsWith("#");

  // Get current shade from value like "gray.700" -> 7
  React.useEffect(() => {
    if (isGrayColor) {
      const shade = parseInt(value.split(".")[1]) / 100;
      setGrayShade(shade);
    }
  }, [value, isGrayColor]);

  const handleGraySliderChange = (val) => {
    setGrayShade(val);
    const shadeValue = val * 100;
    onChange(`gray.${shadeValue}`);
  };

  const handleHexChange = (hex) => {
    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(hex)) {
      onChange(hex);
    }
    setHexInput(hex);
  };

  const handleChakraColorClick = (color) => {
    onChange(color);
  };

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            variant="outline"
            width="full"
            justifyContent="space-between"
            rightIcon={
              <Box
                w="30px"
                h="30px"
                borderRadius="md"
                bg={value || "gray.500"}
                borderWidth="1px"
                borderColor={borderColor}
              />
            }
          >
            {value || "Select Color"}
          </Button>
        </PopoverTrigger>
        <PopoverContent w="400px">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody p={4}>
            <Tabs variant="enclosed" colorScheme="gray">
              <TabList>
                <Tab>Gray Scale</Tab>
                <Tab>Chakra Colors</Tab>
                <Tab>Hex / Custom</Tab>
              </TabList>

              <TabPanels>
                {/* Gray Scale Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="sm" fontWeight="medium">
                      Adjust Gray Shade
                    </Text>

                    {/* Gray Slider */}
                    <Box>
                      <Slider
                        min={1}
                        max={9}
                        step={1}
                        value={grayShade}
                        onChange={handleGraySliderChange}
                        colorScheme="gray"
                      >
                        <SliderTrack bg="gray.200">
                          <SliderFilledTrack bg="gray.600" />
                        </SliderTrack>
                        <SliderThumb boxSize={6}>
                          <Box color="gray.600" fontSize="xs" fontWeight="bold">
                            {grayShade}
                          </Box>
                        </SliderThumb>
                      </Slider>
                      <HStack justify="space-between" mt={2}>
                        <Text fontSize="xs" color="gray.500">
                          Lighter
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          gray.{grayShade * 100}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Darker
                        </Text>
                      </HStack>
                    </Box>

                    {/* Gray Swatches */}
                    <SimpleGrid columns={5} spacing={2}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((shade) => (
                        <Box
                          key={shade}
                          as="button"
                          onClick={() => handleGraySliderChange(shade)}
                          bg={`gray.${shade * 100}`}
                          h="40px"
                          borderRadius="md"
                          borderWidth="2px"
                          borderColor={
                            grayShade === shade ? "gray.900" : "transparent"
                          }
                          _hover={{
                            borderColor: "gray.600",
                            transform: "scale(1.05)",
                          }}
                          transition="all 0.2s"
                          position="relative"
                        >
                          <Text
                            fontSize="xs"
                            color={shade > 5 ? "white" : "gray.800"}
                            fontWeight="bold"
                          >
                            {shade * 100}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>

                    {/* Preview */}
                    <Box
                      p={4}
                      bg={`gray.${grayShade * 100}`}
                      borderRadius="md"
                      textAlign="center"
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={grayShade > 5 ? "white" : "gray.800"}
                      >
                        Preview: gray.{grayShade * 100}
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Chakra Colors Tab */}
                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    {Object.entries(CHAKRA_COLORS).map(
                      ([colorName, shades]) => (
                        <Box key={colorName}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            mb={2}
                            textTransform="capitalize"
                          >
                            {colorName}
                          </Text>
                          <SimpleGrid columns={9} spacing={1}>
                            {shades.map((color) => (
                              <Box
                                key={color}
                                as="button"
                                onClick={() => handleChakraColorClick(color)}
                                bg={color}
                                h="32px"
                                borderRadius="sm"
                                borderWidth="2px"
                                borderColor={
                                  value === color ? "gray.900" : "transparent"
                                }
                                _hover={{
                                  borderColor: "gray.600",
                                  transform: "scale(1.1)",
                                }}
                                transition="all 0.2s"
                                title={color}
                              />
                            ))}
                          </SimpleGrid>
                        </Box>
                      )
                    )}
                  </VStack>
                </TabPanel>

                {/* Hex / Custom Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {/* Hex Input */}
                    <FormControl>
                      <FormLabel fontSize="sm">Hex Color</FormLabel>
                      <HStack>
                        <Input
                          value={hexInput || (isHexColor ? value : "")}
                          onChange={(e) => setHexInput(e.target.value)}
                          placeholder="#FF5733"
                          maxLength={7}
                        />
                        <Button
                          bg={useColorModeValue("gray.900", "gray.100")}
                          color={useColorModeValue("white", "gray.900")}
                          _hover={{
                            bg: useColorModeValue("gray.800", "gray.200"),
                          }}
                          onClick={() => handleHexChange(hexInput)}
                          isDisabled={!hexInput}
                        >
                          Apply
                        </Button>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Format: #RRGGBB (e.g., #FF5733)
                      </Text>
                    </FormControl>

                    {/* Preset Hex Colors */}
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Preset Colors
                      </Text>
                      <SimpleGrid columns={9} spacing={2}>
                        {PRESET_HEX_COLORS.map((color) => (
                          <Box
                            key={color}
                            as="button"
                            onClick={() => onChange(color)}
                            bg={color}
                            h="32px"
                            borderRadius="md"
                            borderWidth="2px"
                            borderColor={
                              value === color ? "gray.900" : "gray.300"
                            }
                            _hover={{
                              borderColor: "gray.600",
                              transform: "scale(1.1)",
                            }}
                            transition="all 0.2s"
                            title={color}
                          />
                        ))}
                      </SimpleGrid>
                    </Box>

                    {/* HTML Color Input */}
                    <FormControl>
                      <FormLabel fontSize="sm">Visual Color Picker</FormLabel>
                      <HStack>
                        <Input
                          type="color"
                          value={isHexColor ? value : "#718096"}
                          onChange={(e) => onChange(e.target.value)}
                          h="50px"
                          cursor="pointer"
                        />
                        <Text fontSize="sm">{value}</Text>
                      </HStack>
                    </FormControl>

                    {/* Current Color Preview */}
                    {value && (
                      <Box
                        p={6}
                        bg={value}
                        borderRadius="md"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="white"
                          textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                        >
                          Current: {value}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {/* Current Value Display */}
      <HStack mt={2} spacing={2}>
        <Box
          w="20px"
          h="20px"
          bg={value || "gray.500"}
          borderRadius="sm"
          borderWidth="1px"
          borderColor={borderColor}
        />
        <Input
          size="sm"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="gray.700 or #FF5733"
        />
      </HStack>
    </FormControl>
  );
}
