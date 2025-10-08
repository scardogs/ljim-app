import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  useToast,
  useColorModeValue,
  Spinner,
  Center,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { DeleteIcon, EmailIcon } from "@chakra-ui/icons";
import { FiUsers, FiClock, FiShield } from "react-icons/fi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statBg = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: deleteUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Refresh users list
        fetchUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
      setDeleteUserId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentUserId = () => {
    const userData = localStorage.getItem("adminUser");
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="gray.600" thickness="4px" />
          <Text color="gray.500">Loading users...</Text>
        </VStack>
      </Center>
    );
  }

  const currentUserId = getCurrentUserId();

  return (
    <Box maxW="1400px" mx="auto">
      {/* Header */}
      <Flex mb={8} justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Heading size="lg">User Management</Heading>
          <Text fontSize="sm" color="gray.500">
            Manage admin accounts and permissions
          </Text>
        </VStack>
        <Button
          variant="outline"
          borderColor={useColorModeValue("gray.700", "gray.300")}
          color={useColorModeValue("gray.700", "gray.300")}
          _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          onClick={fetchUsers}
        >
          Refresh
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg={statBg} shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUsers} />
                  <Text>Total Admins</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{users.length}</StatNumber>
              <StatHelpText>Registered accounts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={statBg} shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiClock} />
                  <Text>Latest Registration</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="lg">
                {users.length > 0 ? users[0].name : "N/A"}
              </StatNumber>
              <StatHelpText>
                {users.length > 0 ? formatDate(users[0].createdAt) : "No users"}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={statBg} shadow="md">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiShield} />
                  <Text>Your Account</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="lg">
                {users.find((u) => u._id === currentUserId)?.name || "Unknown"}
              </StatNumber>
              <StatHelpText>Currently logged in</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Users List */}
      <VStack spacing={4} align="stretch">
        <Heading size="md" mb={2}>
          Admin Accounts
        </Heading>

        {users.map((user) => (
          <Card
            key={user._id}
            bg={cardBg}
            shadow="md"
            borderWidth={user._id === currentUserId ? "2px" : "1px"}
            borderColor={user._id === currentUserId ? "gray.600" : borderColor}
          >
            <CardBody p={6}>
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "start", md: "center" }}
                gap={4}
              >
                <HStack spacing={4} flex={1}>
                  <Avatar
                    name={user.name}
                    size="lg"
                    bg="gray.600"
                    color="white"
                  />
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontSize="lg" fontWeight="bold">
                        {user.name}
                      </Text>
                      {user._id === currentUserId && (
                        <Badge colorScheme="green">You</Badge>
                      )}
                    </HStack>
                    <HStack spacing={3} fontSize="sm" color="gray.500">
                      <HStack>
                        <EmailIcon />
                        <Text>{user.email}</Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={3} fontSize="xs" color="gray.400">
                      <Text>
                        <strong>Role:</strong> {user.role || "Admin"}
                      </Text>
                      <Text>•</Text>
                      <Text>
                        <strong>Created:</strong> {formatDate(user.createdAt)}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                <VStack spacing={2}>
                  <Badge colorScheme="gray" px={3} py={1} borderRadius="md">
                    {user.role || "Admin"}
                  </Badge>

                  {user._id !== currentUserId && (
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(user._id)}
                      aria-label="Delete user"
                    />
                  )}
                </VStack>
              </Flex>
            </CardBody>
          </Card>
        ))}

        {users.length === 0 && (
          <Center p={10}>
            <VStack spacing={3}>
              <Icon as={FiUsers} boxSize={12} color="gray.400" />
              <Text color="gray.500">No admin users found</Text>
            </VStack>
          </Center>
        )}
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Admin Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this admin account? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
