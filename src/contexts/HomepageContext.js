import React, { createContext, useContext, useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/admin/homepage");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error("Error fetching homepage content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const value = {
    content,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      fetch("/api/admin/homepage")
        .then((res) => res.json())
        .then((data) => {
          setContent(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error refetching homepage content:", err);
          setError(err.message);
          setLoading(false);
        });
    },
  };

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  );
};
