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
  Spinner,
  Center,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  Badge,
  HStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { StarIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { FiHeart, FiMessageSquare, FiSettings } from "react-icons/fi";
import DebouncedInput from "./DebouncedInput";
import DebouncedTextarea from "./DebouncedTextarea";

export default function PrayerRequestsEditor() {
  const [content, setContent] = useState(null);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("white", "gray.900");
  const buttonBg = useColorModeValue("gray.900", "gray.100");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.200");

  const fetchContent = React.useCallback(async () => {
    try {
      const response = await fetch("/api/prayer-requests/content");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchPrayerRequests = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/prayer-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPrayerRequests(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContent();
    fetchPrayerRequests();
  }, [fetchContent, fetchPrayerRequests]);

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/prayer-requests/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prayer requests page content updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/prayer-requests/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Approved",
          description: "Prayer request has been approved",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchPrayerRequests();
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUnapprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `/api/admin/prayer-requests/${id}/unapprove`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Unapproved",
          description: "Prayer request has been hidden from public",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchPrayerRequests();
      }
    } catch (error) {
      console.error("Error unapproving request:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/prayer-requests/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "Prayer request has been deleted",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        fetchPrayerRequests();
        onClose();
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    onOpen();
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="gray.600" thickness="4px" />
          <Text color="gray.500">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  const pendingRequests = prayerRequests.filter((r) => !r.isApproved);
  const approvedRequests = prayerRequests.filter((r) => r.isApproved);

  const RequestCard = ({ request }) => (
    <Card variant="outline" mb={4}>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{request.name}</Text>
              {request.email && (
                <Text fontSize="sm" color="gray.500">
                  {request.email}
                </Text>
              )}
            </VStack>
            <HStack>
              <Badge colorScheme={request.isPublic ? "green" : "gray"}>
                {request.isPublic ? "Public" : "Private"}
              </Badge>
              <Badge colorScheme={request.isApproved ? "blue" : "yellow"}>
                {request.isApproved ? "Approved" : "Pending"}
              </Badge>
            </HStack>
          </HStack>

          <Text>{request.request}</Text>

          <HStack justify="space-between">
            <HStack spacing={4} fontSize="sm" color="gray.500">
              <HStack>
                <Icon as={FiHeart} />
                <Text>{request.prayerCount} prayers</Text>
              </HStack>
              <Text>{new Date(request.createdAt).toLocaleDateString()}</Text>
            </HStack>

            <HStack>
              {request.isApproved ? (
                <IconButton
                  size="sm"
                  icon={<CloseIcon />}
                  colorScheme="orange"
                  onClick={() => handleUnapprove(request._id)}
                  title="Unapprove"
                />
              ) : (
                <IconButton
                  size="sm"
                  icon={<CheckIcon />}
                  colorScheme="green"
                  onClick={() => handleApprove(request._id)}
                  title="Approve"
                />
              )}
              <IconButton
                size="sm"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => confirmDelete(request._id)}
                title="Delete"
              />
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const SectionHeader = ({ icon, title }) => (
    <Flex align="center" gap={3} mb={4}>
      <Icon as={icon} boxSize={6} color="gray.600" />
      <Heading size="md">{title}</Heading>
    </Flex>
  );

  return (
    <Box maxW="1400px" mx="auto" pb={{ base: 20, md: 6 }}>
      {/* Header with Save Button */}
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
          <Heading size={{ base: "md", md: "lg" }}>Prayer Requests</Heading>
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
          >
            Manage prayer requests and page content
          </Text>
        </VStack>
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          onClick={handleSaveContent}
          isLoading={isSaving}
          loadingText="Saving..."
          size={{ base: "md", md: "lg" }}
          w={{ base: "full", md: "auto" }}
          leftIcon={<Icon as={StarIcon} />}
        >
          Save Content
        </Button>
      </Flex>

      <Tabs colorScheme="blue" px={{ base: 2, md: 6 }}>
        <TabList>
          <Tab>
            <HStack>
              <Icon as={FiMessageSquare} />
              <Text>Requests ({prayerRequests.length})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Icon as={FiSettings} />
              <Text>Page Content</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Prayer Requests Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Statistics */}
              <HStack spacing={4} flexWrap="wrap">
                <Card flex={1} minW="150px">
                  <CardBody textAlign="center">
                    <Text fontSize="3xl" fontWeight="bold">
                      {prayerRequests.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Total Requests
                    </Text>
                  </CardBody>
                </Card>
                <Card flex={1} minW="150px">
                  <CardBody textAlign="center">
                    <Text fontSize="3xl" fontWeight="bold" color="yellow.500">
                      {pendingRequests.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Pending Approval
                    </Text>
                  </CardBody>
                </Card>
                <Card flex={1} minW="150px">
                  <CardBody textAlign="center">
                    <Text fontSize="3xl" fontWeight="bold" color="green.500">
                      {approvedRequests.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Approved
                    </Text>
                  </CardBody>
                </Card>
              </HStack>

              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <Box>
                  <Heading size="md" mb={4} color="yellow.600">
                    Pending Approval ({pendingRequests.length})
                  </Heading>
                  {pendingRequests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </Box>
              )}

              {/* Approved Requests */}
              {approvedRequests.length > 0 && (
                <Box>
                  <Heading size="md" mb={4} color="green.600">
                    Approved Requests ({approvedRequests.length})
                  </Heading>
                  {approvedRequests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </Box>
              )}

              {prayerRequests.length === 0 && (
                <Center p={10}>
                  <Text color="gray.500">No prayer requests yet</Text>
                </Center>
              )}
            </VStack>
          </TabPanel>

          {/* Page Content Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Main Section */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader icon={FiMessageSquare} title="Main Section" />
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Page Title</FormLabel>
                      <DebouncedInput
                        value={content?.title || ""}
                        onChange={(value) => updateField("title", value)}
                        size="lg"
                        placeholder="Prayer Requests"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Subtitle</FormLabel>
                      <DebouncedTextarea
                        value={content?.subtitle || ""}
                        onChange={(value) => updateField("subtitle", value)}
                        rows={2}
                        placeholder="Share your prayer needs with our community."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">Description</FormLabel>
                      <DebouncedTextarea
                        value={content?.description || ""}
                        onChange={(value) => updateField("description", value)}
                        rows={3}
                        placeholder="We believe in the power of prayer..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Form Section */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader icon={FiSettings} title="Form Section" />
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Form Title</FormLabel>
                      <DebouncedInput
                        value={content?.formTitle || ""}
                        onChange={(value) => updateField("formTitle", value)}
                        placeholder="Submit a Prayer Request"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">
                        Submit Button Text
                      </FormLabel>
                      <DebouncedInput
                        value={content?.submitButtonText || ""}
                        onChange={(value) =>
                          updateField("submitButtonText", value)
                        }
                        placeholder="Submit Prayer Request"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">
                        Success Message
                      </FormLabel>
                      <DebouncedTextarea
                        value={content?.successMessage || ""}
                        onChange={(value) =>
                          updateField("successMessage", value)
                        }
                        rows={3}
                        placeholder="Thank you! Your prayer request has been received..."
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Prayer Wall Section */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardBody p={{ base: 4, md: 8 }}>
                  <SectionHeader icon={FiHeart} title="Prayer Wall Section" />
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="semibold">Wall Title</FormLabel>
                      <DebouncedInput
                        value={content?.wallTitle || ""}
                        onChange={(value) => updateField("wallTitle", value)}
                        placeholder="Prayer Wall"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">
                        Wall Description
                      </FormLabel>
                      <DebouncedTextarea
                        value={content?.wallDescription || ""}
                        onChange={(value) =>
                          updateField("wallDescription", value)
                        }
                        rows={2}
                        placeholder="Join us in prayer for these requests..."
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold">
                        Pray Button Text
                      </FormLabel>
                      <DebouncedInput
                        value={content?.prayButtonText || ""}
                        onChange={(value) =>
                          updateField("prayButtonText", value)
                        }
                        placeholder="I Prayed"
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Prayer Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this prayer request? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Floating Save Button (Mobile) */}
      <Box
        position="fixed"
        bottom={6}
        right={6}
        zIndex={20}
        display={{ base: "block", md: "none" }}
      >
        <Button
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: buttonHoverBg }}
          onClick={handleSaveContent}
          isLoading={isSaving}
          size="lg"
          shadow="2xl"
          leftIcon={<Icon as={StarIcon} />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
