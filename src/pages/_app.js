import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FloatingChatButton from "../shared/FloatingChatButton";
import FloatingChatWidget from "../shared/FloatingChatWidget";
import { Analytics } from "@vercel/analytics/next";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  useEffect(() => {
    // Optional: set body background for immersive UI
    document.body.style.background = "var(--chakra-colors-gray-900)";
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {/* Removed ColorModeScript to force dark mode */}
      <Component {...pageProps} />
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <FloatingChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <Analytics />
    </ChakraProvider>
  );
}

export default MyApp;
