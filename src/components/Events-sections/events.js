import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Input,
  Button,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";

export default function Events() {
  const bgGradient = useColorModeValue(
    "linear(to-b, white, gray.100)",
    "linear(to-b, gray.900, black)"
  );
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue(
    "rgba(255,255,255,0.85)",
    "rgba(0,0,0,0.45)"
  );
  const cardBg = useColorModeValue("whiteAlpha.800", "blackAlpha.400");
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const accentLine = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const [events, setEvents] = useState([
    { date: "2025-10-10", title: "Sunday Worship Service" },
    { date: "2025-10-12", title: "Community Outreach" },
  ]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const handleAddEvent = () => {
    if (newEventTitle && newEventDate) {
      setEvents([...events, { title: newEventTitle, date: newEventDate }]);
      setNewEventTitle("");
      setNewEventDate("");
    }
  };

  const today = new Date().toDateString();

  return (
    <Box
      minH="100vh"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      bgGradient={bgGradient}
      position="relative"
    >
      {/* Decorative lines in background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        backgroundSize="20px 20px"
        backgroundImage="
          linear-gradient(to right, gray 1px, transparent 1px),
          linear-gradient(to bottom, gray 1px, transparent 1px)"
        opacity={0.1}
        zIndex={0}
      />
      <VStack spacing={12} maxW="6xl" mx="auto">
        {/* Heading */}
        <Box
          bg={sectionBg}
          p={8}
          borderRadius="2xl"
          w="100%"
          shadow="xl"
          textAlign="center"
          position="relative"
        >
          <Heading color={textColor} fontFamily="monospace">
            Events
          </Heading>
          <Text
            color={subTextColor}
            fontFamily="monospace"
            mt={4}
            fontSize="lg"
          >
            Stay up-to-date with upcoming events and schedule new ones.
          </Text>
        </Box>

        {/* Schedule Event Form */}
        <Box
          bg={sectionBg}
          p={6}
          borderRadius="2xl"
          w="100%"
          shadow="md"
          border="1px solid"
          borderColor={accentLine}
          position="relative"
        >
          <Heading size="md" color={textColor} mb={4}>
            Schedule a New Event
          </Heading>
          <VStack spacing={4}>
            <Input
              fontFamily="monospace"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              bg={inputBg}
              color={textColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={accentLine}
            />
            <Input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              bg={inputBg}
              color={textColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={accentLine}
            />
            <Button
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              w="100%"
              borderRadius="lg"
              fontFamily="monospace"
              onClick={handleAddEvent}
              transition="all 0.3s ease"
            >
              Add Event
            </Button>
          </VStack>
        </Box>

        {/* Calendar Grid */}
        <Box
          bg={sectionBg}
          p={6}
          borderRadius="2xl"
          w="100%"
          shadow="md"
          border="1px solid"
          borderColor={accentLine}
          position="relative"
        >
          <Heading size="md" color={textColor} mb={4}>
            Upcoming Events
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {events.map((event, idx) => {
              const isToday = new Date(event.date).toDateString() === today;
              return (
                <Box
                  key={idx}
                  bg={cardBg}
                  p={4}
                  borderRadius="xl"
                  boxShadow="md"
                  borderLeft={`5px solid ${isToday ? "teal" : "gray"}`}
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                  transition="all 0.3s ease"
                >
                  <Badge
                    colorScheme={isToday ? "teal" : "gray"}
                    mb={2}
                    p={1}
                    borderRadius="md"
                    fontSize="0.8rem"
                  >
                    {new Date(event.date).toDateString()}
                  </Badge>
                  <Text
                    fontWeight="bold"
                    fontFamily="monospace"
                    color={textColor}
                    fontSize="lg"
                  >
                    {event.title}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
}
