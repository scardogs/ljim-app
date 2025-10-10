import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Badge,
  Spinner,
  Center,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import OptimizedImage from "../OptimizedImage";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const accentLine = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  // Fetch events from database
  useEffect(() => {
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setIsLoading(false);
      });
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);

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
            Upcoming Events
          </Heading>
          <Text
            color={subTextColor}
            fontFamily="monospace"
            mt={4}
            fontSize="lg"
          >
            Join us for our upcoming ministry events and gatherings
          </Text>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Center w="100%" py={10}>
            <VStack spacing={4}>
              <Spinner size="xl" color="gray.600" thickness="4px" />
              <Text color={subTextColor}>Loading events...</Text>
            </VStack>
          </Center>
        )}

        {/* Events Grid */}
        {!isLoading && upcomingEvents.length > 0 && (
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
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {upcomingEvents.map((event, idx) => {
                const eventDate = new Date(event.date);
                const isToday =
                  eventDate.toDateString() === today.toDateString();
                return (
                  <Box
                    key={idx}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="lg"
                    borderLeft={`5px solid`}
                    borderLeftColor={isToday ? "purple.500" : "teal.500"}
                    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                    transition="all 0.3s ease"
                    overflow="hidden"
                  >
                    {event.image && (
                      <Box w="100%" h="150px" overflow="hidden">
                        <OptimizedImage
                          src={event.image}
                          alt={event.title}
                          width={600}
                          height={150}
                          crop="fill"
                          gravity="auto"
                          quality="auto"
                          format="auto"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                    <VStack align="stretch" p={5} spacing={3}>
                      <Badge
                        colorScheme={isToday ? "purple" : "teal"}
                        alignSelf="flex-start"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="0.75rem"
                      >
                        {eventDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Badge>
                      <Heading
                        size="md"
                        fontFamily="monospace"
                        color={textColor}
                        noOfLines={2}
                      >
                        {event.title}
                      </Heading>
                      {event.time && (
                        <HStack fontSize="sm" color={subTextColor}>
                          <Icon as={FiClock} />
                          <Text>{event.time}</Text>
                        </HStack>
                      )}
                      {event.location && (
                        <HStack fontSize="sm" color={subTextColor}>
                          <Icon as={FiMapPin} />
                          <Text noOfLines={1}>{event.location}</Text>
                        </HStack>
                      )}
                      {event.description && (
                        <Text
                          fontSize="sm"
                          color={subTextColor}
                          noOfLines={3}
                          fontFamily="monospace"
                        >
                          {event.description}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        )}

        {/* No Events State */}
        {!isLoading && upcomingEvents.length === 0 && (
          <Box
            bg={sectionBg}
            p={10}
            borderRadius="2xl"
            w="100%"
            shadow="md"
            textAlign="center"
          >
            <Icon as={FiCalendar} boxSize={16} color="gray.400" mb={4} />
            <Heading size="md" color={textColor} mb={2}>
              No Upcoming Events
            </Heading>
            <Text color={subTextColor} fontFamily="monospace">
              Check back soon for new events and gatherings
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
