import { useState, useEffect } from 'react';

/**
 * Hook that debounces a value by the specified delay.
 * @param {*} value - The value to debounce.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
