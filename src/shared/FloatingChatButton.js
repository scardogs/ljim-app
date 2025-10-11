import React from "react";
import { IconButton, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(192, 192, 192, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(192, 192, 192, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(192, 192, 192, 0);
  }
`;

export default function FloatingChatButton({ onClick }) {
  const router = useRouter();
  const bg = useColorModeValue(
    "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
    "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
  );
  const hoverBg = useColorModeValue(
    "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
    "linear-gradient(135deg, #0f1419 0%, #1a202c 100%)"
  );
  const color = "white";

  // Hide on chat page to avoid redundancy
  if (router.pathname === "/chat") return null;

  return (
    <Tooltip
      label="Chat with us"
      placement="left"
      hasArrow
      bg="gray.800"
      color="white"
      fontSize="sm"
      px={3}
      py={2}
      borderRadius="md"
    >
      <IconButton
        aria-label="Open chat"
        icon={<ChatIcon w={6} h={6} />}
        position="fixed"
        right={{ base: 4, md: 6 }}
        bottom={{ base: 4, md: 6 }}
        zIndex={50}
        color={color}
        bgGradient="linear(135deg, #2d3748 0%, #4a5568 100%)"
        variant="solid"
        _hover={{
          bgGradient: "linear(135deg, #4a5568 0%, #718096 100%)",
          transform: "scale(1.1) translateY(-2px)",
          boxShadow:
            "0 20px 40px rgba(160, 174, 192, 0.5), 0 0 30px rgba(203, 213, 224, 0.4)",
        }}
        _active={{
          transform: "scale(0.95)",
          bgGradient: "linear(135deg, #1a202c 0%, #2d3748 100%)",
        }}
        size="lg"
        w="60px"
        h="60px"
        borderRadius="full"
        onClick={onClick || (() => router.push("/chat"))}
        boxShadow="0 10px 30px rgba(160, 174, 192, 0.4), 0 0 20px rgba(203, 213, 224, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        border="2px solid"
        borderColor="whiteAlpha.400"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        animation={`${pulse} 2s infinite`}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "full",
          padding: "2px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </Tooltip>
  );
}
