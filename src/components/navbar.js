import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Spacer,
  useColorModeValue,
  useColorMode,
  HStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  Link,
  Button,
  Image,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  LockIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navbarContent, setNavbarContent] = useState(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch navbar content
  useEffect(() => {
    fetch("/api/navbar/content")
      .then((res) => res.json())
      .then((data) => setNavbarContent(data))
      .catch((err) => console.error("Error fetching navbar content:", err));
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Top-level hooks for colors
  const bg = useColorModeValue(
    scrolled ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
    scrolled ? "rgba(26, 32, 44, 0.6)" : "rgba(26, 32, 44, 0.3)"
  );
  const color = useColorModeValue("gray.800", "gray.100");
  const accent = useColorModeValue("#A0A0A0", "#C0C0C0");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const dropdownHoverBg = useColorModeValue("gray.100", "gray.700");
  const drawerBg = useColorModeValue(
    "rgba(255,255,255,0.9)",
    "rgba(26,32,44,0.9)"
  );

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Bible", href: "/bible" },
    { label: "Music", href: "/music", hasDropdown: true },
    { label: "Events", href: "/events" },
    { label: "Shop", href: "/shop" },
    { label: "Prayer", href: "/prayer-requests" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <Box
        as="nav"
        w="100%"
        px={{ base: 4, md: 8 }}
        py={4}
        position="fixed"
        top={0}
        zIndex={20}
        bg={bg}
        backdropFilter="blur(8px) saturate(120%)"
        borderBottom="1px solid rgba(255, 255, 255, 0.25)"
        boxShadow={scrolled ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none"}
        transition="background 0.3s ease, box-shadow 0.3s ease"
        transform="translateZ(0)"
        willChange="auto"
      >
        <Flex align="center">
          {/* Logo/Brand */}
          <Flex
            align="center"
            gap={3}
            cursor="pointer"
            onClick={() => router.push("/")}
          >
            {navbarContent?.showLogo && navbarContent?.logo && (
              <Image
                src={navbarContent.logo}
                alt="Logo"
                width={`${navbarContent.logoWidth || 40}px`}
                objectFit="contain"
              />
            )}
            <Text
              fontSize={navbarContent?.fontSize || "2xl"}
              fontWeight="bold"
              color={color}
              letterSpacing="wide"
            >
              {navbarContent?.brandText || "LJIM"}
            </Text>
          </Flex>

          <Spacer />

          {/* Desktop Nav */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) =>
              item.hasDropdown ? (
                <Box
                  key={item.label}
                  position="relative"
                  _hover={{ ".dropdown": { display: "block" } }}
                >
                  <Button
                    variant="ghost"
                    color={isActive(item.href) ? accent : color}
                    _hover={{ color: accent }}
                    fontWeight={isActive(item.href) ? "bold" : "medium"}
                    rightIcon={
                      <ChevronDownIcon
                        w={4}
                        h={4}
                        color={isActive(item.href) ? accent : color}
                      />
                    }
                  >
                    {item.label}
                  </Button>

                  {/* Dropdown */}
                  <Box
                    className="dropdown"
                    display="none"
                    position="absolute"
                    top="100%"
                    left={0}
                    bg={dropdownBg}
                    borderRadius="md"
                    boxShadow="md"
                    py={2}
                    minW="150px"
                    zIndex={10}
                  >
                    <VStack align="start" spacing={0}>
                      <Link
                        onClick={() => router.push("/music/lineup")}
                        px={4}
                        py={2}
                        w="full"
                        _hover={{ bg: dropdownHoverBg }}
                      >
                        Song Line Up
                      </Link>
                      <Link
                        onClick={() => router.push("/music/composition")}
                        px={4}
                        py={2}
                        w="full"
                        _hover={{ bg: dropdownHoverBg }}
                      >
                        Song Composition
                      </Link>
                    </VStack>
                  </Box>
                </Box>
              ) : (
                <Link
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  position="relative"
                  color={isActive(item.href) ? accent : color}
                  _hover={{ color: accent }}
                  fontWeight={isActive(item.href) ? "bold" : "medium"}
                  transition="color 0.2s"
                >
                  {item.label}
                  {isActive(item.href) && (
                    <Box
                      position="absolute"
                      bottom={-1}
                      left="50%"
                      transform="translateX(-50%)"
                      w="60%"
                      h="2px"
                      bg={accent}
                      borderRadius="full"
                    />
                  )}
                </Link>
              )
            )}

            <Button
              size="sm"
              variant="outline"
              borderColor={accent}
              color={color}
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              onClick={() => router.push("/give")}
            >
              Give
            </Button>

            {!isAuthenticated ? (
              <Button
                size="sm"
                variant="solid"
                bg={accent}
                color="white"
                leftIcon={<LockIcon />}
                _hover={{ bg: "gray.600" }}
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                size="sm"
                variant="solid"
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                onClick={() => router.push("/admin")}
              >
                Admin
              </Button>
            )}

            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              color={color}
              fontSize="xl"
            />
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            onClick={onOpen}
            variant="ghost"
            color={color}
            fontSize="2xl"
          />
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent bg={drawerBg} backdropFilter="blur(6px)">
          <DrawerCloseButton />
          <DrawerBody mt={12}>
            <VStack spacing={6} align="start">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <VStack key={item.label} align="start" spacing={2}>
                    <Text fontWeight="bold" color={color}>
                      {item.label}
                    </Text>
                    <Link
                      onClick={() => {
                        router.push("/music/lineup");
                        onClose();
                      }}
                      color={color}
                      _hover={{ color: accent }}
                    >
                      Song Line Up
                    </Link>
                    <Link
                      onClick={() => {
                        router.push("/music/composition");
                        onClose();
                      }}
                      color={color}
                      _hover={{ color: accent }}
                    >
                      Song Composition
                    </Link>
                  </VStack>
                ) : (
                  <Link
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    w="100%"
                    fontSize="lg"
                    color={color}
                    _hover={{ color: accent }}
                  >
                    {item.label}
                  </Link>
                )
              )}

              <Button
                w="full"
                variant="outline"
                borderColor={accent}
                color={color}
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={() => {
                  router.push("/give");
                  onClose();
                }}
              >
                Give
              </Button>

              {!isAuthenticated ? (
                <Button
                  w="full"
                  variant="solid"
                  bg={accent}
                  color="white"
                  leftIcon={<LockIcon />}
                  _hover={{ bg: "gray.600" }}
                  onClick={() => {
                    router.push("/login");
                    onClose();
                  }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  w="full"
                  variant="solid"
                  bg="green.500"
                  color="white"
                  _hover={{ bg: "green.600" }}
                  onClick={() => {
                    router.push("/admin");
                    onClose();
                  }}
                >
                  Admin
                </Button>
              )}

              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                color={color}
                w="full"
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
