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
  const bg = useColorModeValue(
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

  return (
    <Box
      minH="100vh"
      bgGradient={bg}
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <VStack spacing={12} maxW="6xl" mx="auto">
        {/* Heading */}
        <Box bg={sectionBg} p={8} borderRadius="xl" w="100%">
          <Heading color={textColor}>Events</Heading>
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
        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
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
            />
            <Input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              bg={inputBg}
              color={textColor}
            />
            <Button
              bg="white"
              color="black"
              border="1px solid black"
              _hover={{ bg: "black", color: "white" }}
              onClick={handleAddEvent}
            >
              Add Event
            </Button>
          </VStack>
        </Box>

        {/* Calendar Grid */}
        <Box bg={sectionBg} p={6} borderRadius="xl" w="100%">
          <Heading size="md" color={textColor} mb={4}>
            Upcoming Events
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {events.map((event, idx) => (
              <Box
                key={idx}
                bg={cardBg}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
                transition="all 0.3s ease"
              >
                <Badge
                  colorScheme="gray"
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
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
}
