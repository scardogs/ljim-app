import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  VStack,
  useColorModeValue,
  Text,
  HStack,
  Avatar,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function FloatingChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hi! I'm Elai. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState(".");

  // Modern color scheme - ALL hooks at top before any returns
  const containerBg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(26, 32, 44, 0.95)"
  );
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
  );
  const border = useColorModeValue("gray.200", "gray.700");
  const bubbleUser = useColorModeValue(
    "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    "linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)"
  );
  const bubbleModel = useColorModeValue("gray.100", "gray.800");
  const userTextColor = useColorModeValue("white", "gray.900");
  const modelTextColor = useColorModeValue("gray.800", "gray.100");
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const statusColor = useColorModeValue("green.400", "green.300");
  const scrollbarThumb = useColorModeValue("#cbd5e0", "#4a5568");
  const scrollbarThumbHover = useColorModeValue("#a0aec0", "#718096");
  const bubbleTail = useColorModeValue(
    "8px solid #2d2d2d",
    "8px solid #e2e8f0"
  );
  const inputAreaBg = useColorModeValue(
    "rgba(247, 250, 252, 0.8)",
    "rgba(45, 55, 72, 0.8)"
  );
  const inputFocusBorder = useColorModeValue("gray.700", "gray.300");
  const inputFocusShadow = useColorModeValue("#4a5568", "#cbd5e0");
  const sendButtonBg = useColorModeValue("gray.900", "gray.100");
  const sendButtonColor = useColorModeValue("white", "gray.900");
  const sendButtonHoverBg = useColorModeValue("gray.800", "gray.200");
  const helperTextColor = useColorModeValue("gray.500", "gray.400");

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
      console.error(e);
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
    <MotionBox
      position="fixed"
      right={{ base: 4, md: 6 }}
      bottom={{ base: 4, md: 6 }}
      zIndex={60}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        w={{ base: "88vw", md: "400px" }}
        h={{ base: "70vh", md: "600px" }}
        bg={containerBg}
        backdropFilter="blur(20px) saturate(180%)"
        borderRadius="2xl"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)"
        overflow="hidden"
        borderWidth="1px"
        borderColor={border}
        display="flex"
        flexDirection="column"
      >
        {/* Modern Header */}
        <Box
          bgGradient={headerBg}
          px={5}
          py={4}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative background pattern */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity={0.05}
            backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
            backgroundSize="20px 20px"
          />

          <Flex align="center" justify="space-between" position="relative">
            <HStack spacing={3}>
              <Avatar
                name="Elai"
                size="sm"
                bg="white"
                color="gray.900"
                icon={<FiMessageCircle />}
                boxShadow="0 0 0 2px rgba(255, 255, 255, 0.3)"
              />
              <Box>
                <Text
                  fontWeight="bold"
                  color="white"
                  fontSize="md"
                  letterSpacing="tight"
                >
                  Elai Assistant
                </Text>
                <HStack spacing={1.5} align="center">
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={statusColor}
                    boxShadow={`0 0 8px ${statusColor}`}
                  />
                  <Text fontSize="xs" color="whiteAlpha.800">
                    Online
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <IconButton
              aria-label="Close chat"
              icon={<CloseIcon boxSize={3} />}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={onClose}
              borderRadius="lg"
            />
          </Flex>
        </Box>

        {/* Messages Area */}
        <VStack
          ref={scrollRef}
          align="stretch"
          spacing={4}
          flex="1"
          minH="0"
          overflowY="auto"
          px={4}
          py={5}
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: scrollbarThumb,
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: scrollbarThumbHover,
            },
          }}
        >
          <AnimatePresence>
            {messages.map((m, idx) => (
              <MotionFlex
                key={idx}
                justify={m.role === "user" ? "flex-end" : "flex-start"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  bg={m.role === "user" ? bubbleUser : bubbleModel}
                  bgGradient={m.role === "user" ? bubbleUser : undefined}
                  color={m.role === "user" ? userTextColor : modelTextColor}
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  maxW="85%"
                  fontSize="sm"
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  boxShadow={
                    m.role === "user"
                      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                      : "0 2px 8px rgba(0, 0, 0, 0.08)"
                  }
                  borderWidth={m.role === "user" ? "0" : "1px"}
                  borderColor={border}
                  position="relative"
                  _after={
                    m.role === "user"
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: "-1px",
                          right: "12px",
                          width: "0",
                          height: "0",
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderTop: bubbleTail,
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                        }
                      : {}
                  }
                >
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => (
                        <Box as="ul" pl={4} mb={2} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <Box as="ol" pl={4} mb={2} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <Box as="li" mb={1} {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <Box as="p" mb={2} {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <Box as="strong" fontWeight="bold" {...props} />
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </Box>
              </MotionFlex>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <MotionFlex
              justify="flex-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HStack
                bg={bubbleModel}
                px={4}
                py={3}
                borderRadius="2xl"
                spacing={2}
                borderWidth="1px"
                borderColor={border}
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.08)"
              >
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="gray.400"
                  animation="bounce 1.4s infinite ease-in-out"
                  sx={{
                    "@keyframes bounce": {
                      "0%, 80%, 100%": { transform: "scale(0)" },
                      "40%": { transform: "scale(1)" },
                    },
                  }}
                />
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="gray.400"
                  animation="bounce 1.4s infinite ease-in-out 0.2s"
                  sx={{
                    "@keyframes bounce": {
                      "0%, 80%, 100%": { transform: "scale(0)" },
                      "40%": { transform: "scale(1)" },
                    },
                  }}
                />
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="gray.400"
                  animation="bounce 1.4s infinite ease-in-out 0.4s"
                  sx={{
                    "@keyframes bounce": {
                      "0%, 80%, 100%": { transform: "scale(0)" },
                      "40%": { transform: "scale(1)" },
                    },
                  }}
                />
              </HStack>
            </MotionFlex>
          )}
        </VStack>

        {/* Modern Input Area */}
        <Box
          px={4}
          py={4}
          borderTop="1px solid"
          borderColor={border}
          bg={inputAreaBg}
          backdropFilter="blur(10px)"
        >
          <Flex gap={2} align="center">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              isDisabled={loading}
              size="md"
              bg={inputBg}
              borderColor={inputBorder}
              borderRadius="xl"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: inputFocusBorder,
                boxShadow: `0 0 0 1px ${inputFocusShadow}`,
              }}
              fontSize="sm"
              px={4}
            />
            <IconButton
              aria-label="Send message"
              icon={<FiSend />}
              onClick={sendMessage}
              isLoading={loading}
              bg={sendButtonBg}
              color={sendButtonColor}
              _hover={{
                bg: sendButtonHoverBg,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              size="md"
              borderRadius="xl"
              transition="all 0.2s"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            />
          </Flex>

          {/* Helper Text */}
          <Text fontSize="xs" color={helperTextColor} mt={2} textAlign="center">
            Ask me about the Bible or website help
          </Text>
        </Box>
      </Box>
    </MotionBox>
  );
}
