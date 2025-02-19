import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initalValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const stringValue = localStorage.getItem(key);
    if (stringValue !== null) return JSON.parse(stringValue);

    if (typeof initalValue === "function") {
      return (initalValue as () => T)();
    } else {
      return initalValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value,key]);

  return [value, setValue] as [typeof value, typeof setValue];
}

export default useLocalStorage;
