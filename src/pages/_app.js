import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect } from "react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Optional: set body background for immersive UI
    document.body.style.background = "var(--chakra-colors-gray-900)";
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {/* Removed ColorModeScript to force dark mode */}
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
