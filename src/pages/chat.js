import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ChatIcon } from "@chakra-ui/icons";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hi! I'm Gemini. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState(".");
  const containerBg = useColorModeValue("white", "gray.900");
  const bubbleUser = useColorModeValue("gray.900", "gray.100");
  const bubbleModel = useColorModeValue("gray.200", "gray.800");
  const userTextColor = useColorModeValue("white", "black");
  const modelTextColor = useColorModeValue("black", "white");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isTyping) return;
    const id = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(id);
  }, [isTyping]);

  // No API key UI; backend should be configured via environment

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
    <Flex pt={24} justify="center" px={4}>
      <Box
        w={{ base: "100%", md: "720px" }}
        bg={containerBg}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
      >
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Flex align="center" gap={2}>
            <ChatIcon />
            <Text fontWeight="bold">Support & Bible Chat</Text>
          </Flex>
        </Flex>

        <VStack
          ref={scrollRef}
          align="stretch"
          spacing={3}
          maxH="60vh"
          overflowY="auto"
          px={4}
          py={4}
        >
          {messages.map((m, idx) => (
            <Flex
              key={idx}
              justify={m.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                bg={m.role === "user" ? bubbleUser : bubbleModel}
                color={m.role === "user" ? userTextColor : modelTextColor}
                px={4}
                py={2}
                borderRadius="lg"
                maxW="80%"
                whiteSpace="pre-wrap"
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
                px={4}
                py={2}
                borderRadius="lg"
                maxW="60%"
                fontStyle="italic"
              >
                Typing{typingDots}
              </Box>
            </Flex>
          )}
        </VStack>

        <Flex
          gap={2}
          px={4}
          py={4}
          borderTop="1px solid"
          borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            isDisabled={loading}
          />
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={sendMessage}
            isLoading={loading}
            colorScheme="gray"
          >
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
