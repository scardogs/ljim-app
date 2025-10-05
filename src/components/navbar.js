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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Glass background & color palette
  const bg = useColorModeValue(
    scrolled ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
    scrolled ? "rgba(26, 32, 44, 0.6)" : "rgba(26, 32, 44, 0.3)"
  );
  const color = useColorModeValue("gray.800", "gray.100");
  const accent = useColorModeValue("#A0A0A0", "#C0C0C0"); // silver accent

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Music", href: "/music" },
    { label: "Events", href: "/events" },
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
        backdropFilter="blur(16px) saturate(180%)"
        borderBottom="1px solid rgba(255, 255, 255, 0.25)"
        boxShadow={scrolled ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none"}
        transition="all 0.3s ease"
      >
        <Flex align="center">
          {/* Logo */}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => router.push("/")}
            color={color}
            letterSpacing="wide"
          >
            LJIM
          </Text>

          <Spacer />

          {/* Desktop Nav */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) => (
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
            ))}

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
        <DrawerOverlay />
        <DrawerContent
          bg={useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,32,44,0.9)")}
          backdropFilter="blur(12px)"
        >
          <DrawerCloseButton />
          <DrawerBody mt={12}>
            <VStack spacing={6} align="start">
              {navItems.map((item) => (
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
              ))}
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
