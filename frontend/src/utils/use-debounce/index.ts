import { useEffect, useState } from "react";

export function useDebounce<T>(
  defaultValue: T,
  minLength?: number,
  delay?: number,
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(defaultValue);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof value === "string") {
      if (value.length < (minLength ?? 3) && value.length != 0) return;
    }
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, minLength]);

  return {
    debouncedValue,
    value,
    setValue,
  };
}
