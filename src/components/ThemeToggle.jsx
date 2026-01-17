import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Switch Light/Dark cepat */}
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white/60 dark:bg-slate-900/60 backdrop-blur hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors"
        title={isDark ? "Switch to Light" : "Switch to Dark"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
      </button>

      {/* Pilihan System juga */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="text-sm px-2 py-2 rounded-lg border border-slate-300 bg-white/60 dark:bg-slate-900/60"
        title="Theme mode"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
