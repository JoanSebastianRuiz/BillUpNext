"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar renderizado hasta que el componente esté montado
  if (!mounted) return null;

  return (
    <button
      className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
