import React from "react";
import {
  Box,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";

export default function FooterSection() {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");

  return (
    <Box mt={16} textAlign="center">
      <HStack spacing={6} justify="center" mb={4}>
        <IconButton
          as="a"
          href="https://facebook.com/LiftJesusInternational"
          target="_blank"
          aria-label="Facebook"
          icon={<FaFacebook />}
          variant="ghost"
          fontSize="2xl"
          color={"white"}
          _hover={{ color: "gray.500", transform: "scale(1.1)" }}
        />
        <IconButton
          as="a"
          href="mailto:contact@LJIM.org"
          aria-label="Email"
          icon={<FaEnvelope />}
          variant="ghost"
          fontSize="2xl"
          color={"white"}
          _hover={{ color: "gray.500", transform: "scale(1.1)" }}
        />
        <IconButton
          as="a"
          href="tel:+63XXXXXXX"
          aria-label="Phone"
          icon={<FaPhone />}
          variant="ghost"
          fontSize="2xl"
          color={"white"}
          _hover={{ color: "gray.500", transform: "scale(1.1)" }}
        />
      </HStack>
      <Text color={"white"} fontSize="sm">
        © {new Date().getFullYear()} Lift Jesus InternationalMinistries. All
        rights reserved.
      </Text>
    </Box>
  );
}
