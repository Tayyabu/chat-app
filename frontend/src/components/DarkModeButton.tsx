import { Sun, Moon } from "lucide-react";
import useIsDarkMode from "../hooks/useIsDarkMode";


function DarkModeButton() {
  const [isDark, setIsDark] = useIsDarkMode();
  return (
    <button onClick={() => setIsDark((pre) => !pre)}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}

export default DarkModeButton;
