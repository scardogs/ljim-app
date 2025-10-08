import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@chakra-ui/react";

export default function DebouncedTextarea({
  value,
  onChange,
  delay = 300,
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to update parent
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Textarea {...props} value={localValue || ""} onChange={handleChange} />
  );
}
