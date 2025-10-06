import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";

export default function FloatingChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hi! How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState(".");
  const containerBg = useColorModeValue("white", "gray.900");
  const border = useColorModeValue("gray.300", "gray.700");
  const bubbleUser = useColorModeValue("gray.900", "gray.100");
  const bubbleModel = useColorModeValue("gray.200", "gray.800");
  const userTextColor = useColorModeValue("white", "black");
  const modelTextColor = useColorModeValue("black", "white");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isTyping) return;
    const id = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(id);
  }, [isTyping]);

  // No API key UI; backend should be configured via environment

  if (!isOpen) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: newMessages }),
      });
      const data = await res.json();
      if (res.ok) {
        const reply = data?.reply || "(No response)";
        setMessages((prev) => [...prev, { role: "model", content: reply }]);
      }
    } catch (e) {
      // Swallow errors; no error bubble shown
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      position="fixed"
      right={{ base: 4, md: 6 }}
      bottom={{ base: 4, md: 6 }}
      zIndex={60}
    >
      <Box
        w={{ base: "88vw", md: "380px" }}
        h={{ base: "60vh", md: "520px" }}
        bg={containerBg}
        borderRadius="lg"
        boxShadow="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor={border}
      >
        <Flex
          align="center"
          justify="space-between"
          px={3}
          py={2}
          borderBottom="1px solid"
          borderColor={border}
        >
          <Text fontWeight="bold">Support & Bible Chat</Text>
          <IconButton
            aria-label="Close chat"
            icon={<CloseIcon boxSize={3} />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </Flex>

        <VStack
          ref={scrollRef}
          align="stretch"
          spacing={3}
          h={{ base: "calc(60vh - 100px)", md: "calc(520px - 100px)" }}
          overflowY="auto"
          px={3}
          py={3}
        >
          {messages.map((m, idx) => (
            <Flex
              key={idx}
              justify={m.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                bg={m.role === "user" ? bubbleUser : bubbleModel}
                color={m.role === "user" ? userTextColor : modelTextColor}
                px={3}
                py={2}
                borderRadius="lg"
                maxW="85%"
                whiteSpace="pre-wrap"
                fontSize="sm"
              >
                {m.content}
              </Box>
            </Flex>
          ))}
          {isTyping && (
            <Flex justify="flex-start">
              <Box
                bg={bubbleModel}
                color={modelTextColor}
                px={3}
                py={2}
                borderRadius="lg"
                maxW="65%"
                fontStyle="italic"
                fontSize="sm"
              >
                Typing{typingDots}
              </Box>
            </Flex>
          )}
        </VStack>

        <Flex gap={2} px={3} py={3} borderTop="1px solid" borderColor={border}>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            isDisabled={loading}
            size="sm"
          />
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={sendMessage}
            isLoading={loading}
            colorScheme="gray"
            size="sm"
          >
            Send
          </Button>
        </Flex>
      </Box>

      {/* API key controls removed from UI */}
    </Box>
  );
}
