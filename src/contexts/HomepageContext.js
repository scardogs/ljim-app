import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

const HomepageContext = createContext();

export const useHomepageContent = () => {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error(
      "useHomepageContent must be used within a HomepageProvider"
    );
  }
  return context;
};

export const HomepageProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Check if we have cached content first
    const cachedContent = sessionStorage.getItem("homepage-content");
    const cacheTimestamp = sessionStorage.getItem("homepage-content-timestamp");
    const now = Date.now();
    const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;

    // Use cache if it's less than 5 minutes old
    if (cachedContent && cacheAge < 5 * 60 * 1000) {
      try {
        const parsedContent = JSON.parse(cachedContent);
        setContent(parsedContent);
        setLoading(false);
        setInitialLoadComplete(true);

        // Fetch fresh data in background without showing loading
        fetchContentInBackground();
        return;
      } catch (err) {
        console.warn("Failed to parse cached content:", err);
        sessionStorage.removeItem("homepage-content");
        sessionStorage.removeItem("homepage-content-timestamp");
      }
    }

    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/homepage");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Cache the content with timestamp
      sessionStorage.setItem("homepage-content", JSON.stringify(data));
      sessionStorage.setItem(
        "homepage-content-timestamp",
        Date.now().toString()
      );

      setContent(data);
      setInitialLoadComplete(true);
    } catch (err) {
      console.error("Error fetching homepage content:", err);
      setError(err.message);
      setInitialLoadComplete(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentInBackground = async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("homepage-content", JSON.stringify(data));
        sessionStorage.setItem(
          "homepage-content-timestamp",
          Date.now().toString()
        );
        setContent(data);
      }
    } catch (err) {
      console.warn("Background fetch failed:", err);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      content,
      loading: false, // Never show loading after initial load
      error,
      initialLoadComplete,
      refetch: fetchContentInBackground,
    }),
    [content, error, initialLoadComplete]
  );

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  );
};
