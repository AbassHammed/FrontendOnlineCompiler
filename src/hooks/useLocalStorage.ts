import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const currentValue = window.localStorage.getItem(key);
      if (currentValue !== JSON.stringify(value)) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
