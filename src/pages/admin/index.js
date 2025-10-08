import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Heading,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { FiHome, FiInfo, FiCalendar, FiMail } from "react-icons/fi";

// Import admin section components
import HomepageContentEditor from "../../components/admin/HomepageContentEditor";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push("/");
  };

  const sidebarItems = [
    { id: "home", label: "Home Content", icon: FiHome },
    { id: "about", label: "About", icon: FiInfo },
    { id: "events", label: "Events", icon: FiCalendar },
    { id: "contact", label: "Contact", icon: FiMail },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "home":
        return <HomepageContentEditor />;
      case "about":
        return (
          <Box p={6}>
            <Heading size="lg" mb={4}>
              About Section Editor
            </Heading>
            <Text color="gray.500">Coming soon...</Text>
          </Box>
        );
      case "events":
        return (
          <Box p={6}>
            <Heading size="lg" mb={4}>
              Events Editor
            </Heading>
            <Text color="gray.500">Coming soon...</Text>
          </Box>
        );
      case "contact":
        return (
          <Box p={6}>
            <Heading size="lg" mb={4}>
              Contact Section Editor
            </Heading>
            <Text color="gray.500">Coming soon...</Text>
          </Box>
        );
      default:
        return <HomepageContentEditor />;
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh" bg={bgColor}>
        <Spinner size="xl" color="gray.600" />
      </Center>
    );
  }

  const SidebarContent = () => (
    <VStack align="stretch" spacing={2} h="full">
      <Box p={6} borderBottom="1px" borderColor={borderColor}>
        <Heading size="md" color={textColor}>
          LJIM Admin
        </Heading>
      </Box>

      <VStack align="stretch" spacing={1} p={4} flex={1}>
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            leftIcon={<Box as={item.icon} />}
            variant={currentSection === item.id ? "solid" : "ghost"}
            bg={currentSection === item.id ? "gray.700" : "transparent"}
            color={currentSection === item.id ? "white" : textColor}
            _hover={{
              bg: currentSection === item.id ? "gray.600" : "gray.100",
            }}
            justifyContent="flex-start"
            onClick={() => {
              setCurrentSection(item.id);
              onClose(); // Close mobile drawer
            }}
          >
            {item.label}
          </Button>
        ))}
      </VStack>

      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Button
          leftIcon={<SettingsIcon />}
          variant="ghost"
          w="full"
          justifyContent="flex-start"
        >
          Settings
        </Button>
      </Box>
    </VStack>
  );

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Desktop Sidebar */}
      <Box
        w="250px"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: "none", md: "block" }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg}>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header */}
        <Box
          bg={headerBg}
          borderBottom="1px"
          borderColor={borderColor}
          px={6}
          py={4}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <IconButton
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="ghost"
              />
              <Heading size="md" color={textColor}>
                Dashboard
              </Heading>
            </HStack>

            <HStack spacing={4}>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                >
                  <HStack spacing={2}>
                    <Avatar size="sm" name={user?.name} />
                    <Text display={{ base: "none", md: "block" }}>
                      {user?.name}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push("/")}>
                    View Website
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        {/* Content Area */}
        <Box flex={1} overflow="auto" p={6}>
          {renderContent()}
        </Box>
      </Flex>
    </Flex>
  );
}
