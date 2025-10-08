import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EmailIcon,
  EditIcon,
  AddIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { FiUsers, FiClock, FiShield } from "react-icons/fi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const cancelRef = React.useRef();
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statBg = useColorModeValue("gray.50", "gray.800");

  // Button colors
  const outlineButtonBorderColor = useColorModeValue("gray.700", "gray.300");
  const outlineButtonColor = useColorModeValue("gray.700", "gray.300");
  const outlineButtonHoverBg = useColorModeValue("gray.100", "gray.700");
  const primaryButtonBg = useColorModeValue("gray.900", "gray.100");
  const primaryButtonColor = useColorModeValue("white", "gray.900");
  const primaryButtonHoverBg = useColorModeValue("gray.800", "gray.200");

  const fetchUsers = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    onDeleteOpen();
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
      onDeleteClose();
      setDeleteUserId(null);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "admin",
    });
    onEditOpen();
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });
    onCreateOpen();
  };

  const handleCreateSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Name, email, and password are required",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "New admin user created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
        onCreateClose();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const updatePayload = {
        userId: editUser._id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Only include password if it was changed
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
        onEditClose();
        setEditUser(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
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
      <Flex
        mb={8}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={4}
      >
        <VStack align="start" spacing={1}>
          <Heading size="lg">User Management</Heading>
          <Text fontSize="sm" color="gray.500">
            Manage admin accounts and permissions
          </Text>
        </VStack>
        <HStack>
          <Button
            variant="outline"
            borderColor={outlineButtonBorderColor}
            color={outlineButtonColor}
            _hover={{ bg: outlineButtonHoverBg }}
            onClick={fetchUsers}
          >
            Refresh
          </Button>
          <Button
            leftIcon={<AddIcon />}
            bg={primaryButtonBg}
            color={primaryButtonColor}
            _hover={{ bg: primaryButtonHoverBg }}
            onClick={handleCreateClick}
          >
            Add New User
          </Button>
        </HStack>
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

                <HStack spacing={2}>
                  <IconButton
                    icon={<EditIcon />}
                    variant="ghost"
                    colorScheme="gray"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                    aria-label="Edit user"
                  />

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
                </HStack>
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

      {/* Create User Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Admin User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@ljim.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      aria-label="Toggle password"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Minimum 6 characters
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="editor">Editor</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button
              bg={primaryButtonBg}
              color={primaryButtonColor}
              _hover={{ bg: primaryButtonHoverBg }}
              onClick={handleCreateSubmit}
              isLoading={isCreating}
            >
              Create User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Admin User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@ljim.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Leave blank to keep current password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      aria-label="Toggle password"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Leave blank to keep current password. Minimum 6 characters if
                  changing.
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="editor">Editor</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              bg={primaryButtonBg}
              color={primaryButtonColor}
              _hover={{ bg: primaryButtonHoverBg }}
              onClick={handleUpdateSubmit}
              isLoading={isCreating}
            >
              Update User
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
              Delete Admin Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this admin account? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost">
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
