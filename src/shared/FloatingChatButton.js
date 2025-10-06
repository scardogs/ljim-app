import React from "react";
import { IconButton, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function FloatingChatButton({ onClick }) {
  const router = useRouter();
  const bg = useColorModeValue("gray.800", "gray.700");
  const hoverBg = useColorModeValue("gray.700", "gray.600");
  const activeBg = useColorModeValue("gray.600", "gray.500");
  const color = "white";

  // Hide on chat page to avoid redundancy
  if (router.pathname === "/chat") return null;

  return (
    <Tooltip label="Chat" placement="left">
      <IconButton
        aria-label="Open chat"
        icon={<ChatIcon />}
        position="fixed"
        right={{ base: 4, md: 6 }}
        bottom={{ base: 4, md: 6 }}
        zIndex={50}
        color={color}
        bg={bg}
        colorScheme="gray"
        variant="solid"
        _hover={{ bg: hoverBg }}
        _active={{ bg: activeBg }}
        size="lg"
        borderRadius="full"
        onClick={onClick || (() => router.push("/chat"))}
        boxShadow="0 10px 25px rgba(0,0,0,0.25)"
      />
    </Tooltip>
  );
}
