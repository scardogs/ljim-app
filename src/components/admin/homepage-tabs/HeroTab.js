import React from "react";
import {
  Card,
  CardBody,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Text,
  Divider,
  RadioGroup,
  Radio,
  Stack,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiImage } from "react-icons/fi";
import ImprovedImageUpload from "../ImprovedImageUpload";
import VideoUpload from "../VideoUpload";
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

export default function HeroTab({ content, updateField }) {
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <TabPanel px={{ base: 0, md: 4 }}>
      <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
        <CardBody p={{ base: 4, md: 8 }}>
          <SectionHeader icon={FiImage} title="Hero Section" />
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <FormControl>
                <FormLabel fontWeight="semibold">Hero Title</FormLabel>
                <DebouncedInput
                  value={content.heroTitle || ""}
                  onChange={(value) => updateField("heroTitle", value)}
                  size="lg"
                  placeholder="Lift Jesus International Ministries"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Button Text</FormLabel>
                <DebouncedInput
                  value={content.heroButtonText || ""}
                  onChange={(value) => updateField("heroButtonText", value)}
                  size="lg"
                  placeholder="Learn More"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="semibold">Hero Subtitle</FormLabel>
              <Text fontSize="xs" color="gray.500" mb={2}>
                This text will appear with a typing animation effect
              </Text>
              <DebouncedTextarea
                value={content.heroSubtitle || ""}
                onChange={(value) => updateField("heroSubtitle", value)}
                rows={3}
                placeholder="Exalting the name of Jesus..."
              />
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel fontWeight="semibold">Hero Media Type</FormLabel>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Choose between image, video, or GIF background
              </Text>
              <RadioGroup
                value={content.heroMediaType || "image"}
                onChange={(value) => updateField("heroMediaType", value)}
              >
                <Stack direction="row" spacing={4}>
                  <Radio value="image">Image</Radio>
                  <Radio value="video">Video</Radio>
                  <Radio value="gif">GIF</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {content.heroMediaType === "image" ? (
              <ImprovedImageUpload
                label="Hero Background Image"
                value={content.heroImage || ""}
                onChange={(value) => updateField("heroImage", value)}
                placeholder="/images/your-image.png"
                imageType="homepage/hero"
              />
            ) : (
              <VideoUpload
                label={`Hero Background ${
                  content.heroMediaType === "video" ? "Video" : "GIF"
                }`}
                value={content.heroVideoUrl || ""}
                onChange={(value) => updateField("heroVideoUrl", value)}
                placeholder={
                  content.heroMediaType === "video"
                    ? "https://res.cloudinary.com/your-cloud/video/upload/..."
                    : "https://res.cloudinary.com/your-cloud/image/upload/.../animation.gif"
                }
                mediaType={content.heroMediaType}
                imageType="homepage/hero"
              />
            )}
          </VStack>
        </CardBody>
      </Card>
    </TabPanel>
  );
}

