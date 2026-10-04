import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce values (e.g. search inputs)
 * @param {any} value
 * @param {number} delay in ms
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
