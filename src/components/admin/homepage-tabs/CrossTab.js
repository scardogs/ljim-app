import React from "react";
import {
  Card,
  CardBody,
  VStack,
  FormControl,
  FormLabel,
  Text,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCrosshair } from "react-icons/fi";
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

export default function CrossTab({ content, updateField }) {
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <TabPanel px={{ base: 0, md: 4 }}>
      <Card bg={cardBg} shadow="lg" borderRadius={{ base: "lg", md: "xl" }}>
        <CardBody p={{ base: 4, md: 8 }}>
          <SectionHeader icon={FiCrosshair} title="Glowing Cross Section" />
          <Text fontSize="sm" color="gray.500" mb={6}>
            Customize the Bible verse displayed in the glowing cross section
          </Text>

          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel fontWeight="semibold">Bible Verse</FormLabel>
              <Text fontSize="xs" color="gray.500" mb={2}>
                The verse that appears below the glowing cross
              </Text>
              <DebouncedTextarea
                value={content.crossSectionVerse || ""}
                onChange={(value) => updateField("crossSectionVerse", value)}
                rows={4}
                placeholder='"For the message of the cross..." — 1 Corinthians 1:18 (NIV)'
              />
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
    </TabPanel>
  );
}

