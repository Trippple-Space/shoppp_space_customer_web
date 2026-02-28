import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useDebounce = (value: string, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!value || value.trim() === "") return setDebouncedValue("");
    setIsTyping(true);
    const handler = setTimeout(() => {
      if (value?.includes("<") || value?.includes("/>")) {
         toast.error("Invalid search word or sentence.");
         return
      }
      setDebouncedValue(value);
      setIsTyping(false);
    }, delay);

    return () => clearTimeout(handler);
  }, [value]);

  return { debouncedValue, isTyping };
};
