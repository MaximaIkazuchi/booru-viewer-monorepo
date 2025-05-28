import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Switch } from "./ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Switch
        onCheckedChange={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
        id="theme"
      />
    </div>
  );
}
