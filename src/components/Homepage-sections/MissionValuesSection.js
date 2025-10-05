import React from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  StarIcon,
  InfoOutlineIcon,
  RepeatIcon,
  AtSignIcon,
} from "@chakra-ui/icons";

export default function MissionValuesSection() {
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "gray.400");
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.45)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={useColorModeValue(
        "linear(to-r, gray.100, white)",
        "linear(to-r, gray.800, gray.900)"
      )}
      p={4}
    >
      <Box
        w="full"
        maxW="4xl"
        bg={glassBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        backdropFilter="blur(12px)"
        boxShadow="xl"
        p={{ base: 6, md: 10 }}
        textAlign="left"
        transition="all 0.3s ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
      >
        <Heading
          size="lg"
          mb={6}
          color={textColor}
          borderLeft="4px solid silver"
          pl={4}
        >
          Our Mission & Values
        </Heading>

        <List spacing={4} color={subText} fontSize="lg">
          <ListItem>
            <ListIcon as={StarIcon} color="gray.500" />
            Worship God in Spirit and in Truth.
          </ListItem>
          <ListItem>
            <ListIcon as={InfoOutlineIcon} color="gray.500" />
            Teach the Bible and share the message of salvation.
          </ListItem>
          <ListItem>
            <ListIcon as={RepeatIcon} color="gray.500" />
            Serve communities through outreach and compassion.
          </ListItem>
          <ListItem>
            <ListIcon as={AtSignIcon} color="gray.500" />
            Unite believers to lift the name of Jesus across the world.
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
