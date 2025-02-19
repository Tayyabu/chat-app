import { useEffect } from "react";
import useLocalStorage  from "./useLocalStorage";

function useIsDarkMode() {
  const [isDark, setIsDark] = useLocalStorage( "dark-mode",true);

  useEffect(() => {
    const bodyMode = document.body.classList;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDark ? bodyMode.add("dark") : bodyMode.remove("dark");

    
    
  }, [isDark]);

  return [isDark, setIsDark] as [typeof isDark, typeof setIsDark];
}

export default useIsDarkMode;
