import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Center,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
  IconButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { StarIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import ImprovedImageUpload from "./ImprovedImageUpload";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function EventsEditor() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");
  const addButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const addButtonColor = useColorModeValue("gray.700", "gray.300");
  const addButtonHoverBg = useColorModeValue("gray.100", "gray.700");

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/events");
      const data = await response.json();
      setEvents(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openCreateModal = () => {
    setSelectedEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      image: "",
    });
    setIsEditing(false);
    onOpen();
  };

  const openEditModal = (event) => {
    setSelectedEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    });
    setIsEditing(true);
    onOpen();
  };

  const handleSave = async () => {
    if (!selectedEvent.title || !selectedEvent.date) {
      toast({
        title: "Validation Error",
        description: "Title and date are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch("/api/admin/events", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedEvent),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${
            isEditing ? "updated" : "created"
          } successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchEvents();
        onClose();
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchEvents();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateField = (field, value) => {
    setSelectedEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="gray.600" thickness="4px" />
          <Text color="gray.500">Loading events...</Text>
        </VStack>
      </Center>
    );
  }

  const today = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);
  const pastEvents = events.filter((e) => new Date(e.date) < today);

  return (
    <Box maxW="1400px" mx="auto" pb={{ base: 20, md: 6 }}>
      {/* Header with Add Button */}
      <Flex
        position="sticky"
        top={0}
        bg={headerBg}
        zIndex={10}
        p={{ base: 4, md: 6 }}
        borderBottom="1px"
        borderColor={borderColor}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
        mb={{ base: 4, md: 6 }}
      >
        <VStack align="start" spacing={1}>
          <Heading size={{ base: "md", md: "lg" }}>Events Management</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Create, edit, and manage all ministry events
          </Text>
        </VStack>
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          onClick={openCreateModal}
          size={{ base: "md", md: "lg" }}
          w={{ base: "full", md: "auto" }}
          leftIcon={<Icon as={AddIcon} />}
        >
          Add New Event
        </Button>
      </Flex>

      <VStack spacing={{ base: 4, md: 6 }} px={{ base: 2, md: 6 }}>
        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
          <Card bg={cardBg} shadow="md">
            <CardBody p={4}>
              <VStack>
                <Icon as={FiCalendar} boxSize={8} color="gray.600" />
                <Heading size="lg">{events.length}</Heading>
                <Text fontSize="sm" color="gray.500">
                  Total Events
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg={cardBg} shadow="md">
            <CardBody p={4}>
              <VStack>
                <Icon as={FiCalendar} boxSize={8} color="teal.500" />
                <Heading size="lg">{upcomingEvents.length}</Heading>
                <Text fontSize="sm" color="gray.500">
                  Upcoming
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg={cardBg} shadow="md">
            <CardBody p={4}>
              <VStack>
                <Icon as={FiCalendar} boxSize={8} color="gray.400" />
                <Heading size="lg">{pastEvents.length}</Heading>
                <Text fontSize="sm" color="gray.500">
                  Past Events
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg={cardBg} shadow="md">
            <CardBody p={4}>
              <VStack>
                <Icon as={FiClock} boxSize={8} color="purple.500" />
                <Heading size="lg">
                  {
                    events.filter(
                      (e) =>
                        new Date(e.date).toDateString() === today.toDateString()
                    ).length
                  }
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Today
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Card
            bg={cardBg}
            shadow="lg"
            borderRadius={{ base: "lg", md: "xl" }}
            w="full"
          >
            <CardHeader
              bg={sectionBg}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Flex align="center" gap={3}>
                <Icon as={FiCalendar} boxSize={6} color="teal.500" />
                <Heading size="md">
                  Upcoming Events ({upcomingEvents.length})
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 4, md: 6 }}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={() => openEditModal(event)}
                    onDelete={() => handleDelete(event._id)}
                    cardBg={sectionBg}
                    borderColor={borderColor}
                  />
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <Card
            bg={cardBg}
            shadow="lg"
            borderRadius={{ base: "lg", md: "xl" }}
            w="full"
          >
            <CardHeader
              bg={sectionBg}
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Flex align="center" gap={3}>
                <Icon as={FiCalendar} boxSize={6} color="gray.400" />
                <Heading size="md">Past Events ({pastEvents.length})</Heading>
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 4, md: 6 }}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {pastEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={() => openEditModal(event)}
                    onDelete={() => handleDelete(event._id)}
                    cardBg={sectionBg}
                    borderColor={borderColor}
                    isPast
                  />
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {events.length === 0 && (
          <Card bg={cardBg} shadow="lg" w="full">
            <CardBody p={10}>
              <VStack spacing={4}>
                <Icon as={FiCalendar} boxSize={16} color="gray.400" />
                <Heading size="md" color="gray.500">
                  No events yet
                </Heading>
                <Text color="gray.400">
                  Click &quot;Add New Event&quot; to create your first event
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Event Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? "Edit Event" : "Create New Event"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Event Title</FormLabel>
                <DebouncedInput
                  value={selectedEvent?.title || ""}
                  onChange={(value) => updateField("title", value)}
                  placeholder="Sunday Worship Service"
                  size="lg"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <DebouncedInput
                    type="date"
                    value={selectedEvent?.date || ""}
                    onChange={(value) => updateField("date", value)}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Time</FormLabel>
                  <DebouncedInput
                    value={selectedEvent?.time || ""}
                    onChange={(value) => updateField("time", value)}
                    placeholder="10:00 AM - 12:00 PM"
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <DebouncedInput
                  value={selectedEvent?.location || ""}
                  onChange={(value) => updateField("location", value)}
                  placeholder="Main Church, 123 Faith Street"
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <DebouncedTextarea
                  value={selectedEvent?.description || ""}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Event details and information..."
                  rows={4}
                />
              </FormControl>

              <ImprovedImageUpload
                label="Event Image (Optional)"
                value={selectedEvent?.image || ""}
                onChange={(value) => updateField("image", value)}
                placeholder="/images/event.jpg"
                imageType="events"
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg={buttonBg}
              color={buttonColor}
              _hover={{ bg: buttonHoverBg }}
              onClick={handleSave}
            >
              {isEditing ? "Update Event" : "Create Event"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// EventCard Component
function EventCard({
  event,
  onEdit,
  onDelete,
  cardBg,
  borderColor,
  isPast = false,
}) {
  const today = new Date().toDateString();
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === today;

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderLeft={`5px solid`}
      borderLeftColor={
        isToday ? "purple.500" : isPast ? "gray.400" : "teal.500"
      }
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
      transition="all 0.3s"
      opacity={isPast ? 0.7 : 1}
    >
      <CardBody p={4}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Badge colorScheme={isToday ? "purple" : isPast ? "gray" : "teal"}>
              {eventDate.toLocaleDateString()}
            </Badge>
            <HStack spacing={1}>
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                onClick={onEdit}
                aria-label="Edit event"
              />
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={onDelete}
                aria-label="Delete event"
              />
            </HStack>
          </HStack>

          <Heading size="sm" noOfLines={2}>
            {event.title}
          </Heading>

          {event.time && (
            <HStack fontSize="sm" color="gray.500">
              <Icon as={FiClock} />
              <Text>{event.time}</Text>
            </HStack>
          )}

          {event.location && (
            <HStack fontSize="sm" color="gray.500">
              <Icon as={FiMapPin} />
              <Text noOfLines={1}>{event.location}</Text>
            </HStack>
          )}

          {event.description && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {event.description}
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
