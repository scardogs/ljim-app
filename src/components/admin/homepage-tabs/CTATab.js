import React from "react";
import {
  Card,
  CardBody,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Text,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiTarget } from "react-icons/fi";
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

export default function CTATab({ content, updateField }) {
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <TabPanel px={{ base: 0, md: 4 }}>
      <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
        <CardBody p={{ base: 4, md: 8 }}>
          <SectionHeader icon={FiTarget} title="Call to Action" />
          <Text fontSize="sm" color="gray.500" mb={6}>
            Encourage visitors to take action with a prominent CTA button
          </Text>

          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <FormControl>
                <FormLabel fontWeight="semibold">CTA Title</FormLabel>
                <DebouncedInput
                  value={content.ctaTitle || ""}
                  onChange={(value) => updateField("ctaTitle", value)}
                  size="lg"
                  placeholder="Join Us in Lifting Jesus Higher"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Button Text</FormLabel>
                <DebouncedInput
                  value={content.ctaButtonText || ""}
                  onChange={(value) => updateField("ctaButtonText", value)}
                  size="lg"
                  placeholder="Get Connected"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="semibold">Description</FormLabel>
              <DebouncedTextarea
                value={content.ctaDescription || ""}
                onChange={(value) => updateField("ctaDescription", value)}
                rows={2}
                placeholder="Be part of a community..."
              />
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
    </TabPanel>
  );
}

