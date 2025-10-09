import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  CopyIcon,
  EmailIcon,
} from "@chakra-ui/icons";

export default function RegistrationRequestManager() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalLink, setApprovalLink] = useState("");
  const toast = useToast();

  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();
  const {
    isOpen: isApprovalOpen,
    onOpen: onApprovalOpen,
    onClose: onApprovalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/registration-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch registration requests",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching requests",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `/api/admin/registration-requests/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Approved",
          description: "Registration request has been approved",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setApprovalLink(data.approvalLink);
        onApprovalOpen();
        fetchRequests();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to approve request",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Error",
        description: "An error occurred while approving request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `/api/admin/registration-requests/${selectedRequest._id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Rejected",
          description: "Registration request has been rejected",
          status: "info",
          duration: 5000,
          isClosable: true,
        });

        onRejectClose();
        setRejectionReason("");
        setSelectedRequest(null);
        fetchRequests();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reject request",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/registration-requests", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedRequest._id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Deleted",
          description: "Registration request has been deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onDeleteClose();
        setSelectedRequest(null);
        fetchRequests();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete request",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const copyApprovalLink = () => {
    navigator.clipboard.writeText(approvalLink);
    toast({
      title: "Copied!",
      description: "Approval link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  const RequestCard = ({ request }) => (
    <Card
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="md"
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Heading size="sm" color={textColor}>
              {request.name}
            </Heading>
            <Badge colorScheme={getStatusColor(request.status)}>
              {request.status.toUpperCase()}
            </Badge>
          </HStack>

          <VStack align="stretch" spacing={1}>
            <HStack>
              <EmailIcon color="gray.500" />
              <Text fontSize="sm" color={textColor}>
                {request.email}
              </Text>
            </HStack>

            {request.message && (
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                &ldquo;{request.message}&rdquo;
              </Text>
            )}

            <Text fontSize="xs" color="gray.500">
              Requested: {new Date(request.createdAt).toLocaleDateString()}
            </Text>

            {request.rejectionReason && (
              <Text fontSize="xs" color="red.500">
                Rejection Reason: {request.rejectionReason}
              </Text>
            )}
          </VStack>

          {request.status === "pending" && (
            <HStack spacing={2}>
              <Tooltip label="Approve Request">
                <IconButton
                  icon={<CheckIcon />}
                  colorScheme="green"
                  size="sm"
                  onClick={() => handleApprove(request._id)}
                />
              </Tooltip>
              <Tooltip label="Reject Request">
                <IconButton
                  icon={<CloseIcon />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    onRejectOpen();
                  }}
                />
              </Tooltip>
              <Tooltip label="Delete Request">
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="gray"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    onDeleteOpen();
                  }}
                />
              </Tooltip>
            </HStack>
          )}

          {request.status !== "pending" && (
            <HStack spacing={2}>
              <Tooltip label="Delete Request">
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    onDeleteOpen();
                  }}
                />
              </Tooltip>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg" color={textColor}>
          Registration Requests
        </Heading>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending</StatLabel>
                <StatNumber color="yellow.500">
                  {pendingRequests.length}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Approved</StatLabel>
                <StatNumber color="green.500">
                  {approvedRequests.length}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Rejected</StatLabel>
                <StatNumber color="red.500">
                  {rejectedRequests.length}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Pending ({pendingRequests.length})</Tab>
            <Tab>Approved ({approvedRequests.length})</Tab>
            <Tab>Rejected ({rejectedRequests.length})</Tab>
            <Tab>All ({requests.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {pendingRequests.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  No pending requests
                </Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {pendingRequests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>

            <TabPanel>
              {approvedRequests.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  No approved requests
                </Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {approvedRequests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>

            <TabPanel>
              {rejectedRequests.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  No rejected requests
                </Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {rejectedRequests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>

            <TabPanel>
              {requests.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  No registration requests
                </Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {requests.map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Registration Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                Are you sure you want to reject the registration request from{" "}
                <strong>{selectedRequest?.name}</strong>?
              </Text>
              <FormControl>
                <FormLabel>Reason (Optional)</FormLabel>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRejectClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleReject}>
              Reject Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Approval Link Modal */}
      <Modal isOpen={isApprovalOpen} onClose={onApprovalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registration Approved</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                The registration request has been approved. Share this link with
                the user to complete their registration:
              </Text>
              <FormControl>
                <FormLabel>Approval Link</FormLabel>
                <HStack>
                  <Input value={approvalLink} isReadOnly />
                  <IconButton
                    icon={<CopyIcon />}
                    onClick={copyApprovalLink}
                    aria-label="Copy link"
                  />
                </HStack>
              </FormControl>
              <Text fontSize="sm" color="gray.500">
                This link will expire in 7 days.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onApprovalClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Registration Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this registration request from{" "}
              <strong>{selectedRequest?.name}</strong>? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
