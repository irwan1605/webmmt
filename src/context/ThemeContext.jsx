import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  const ThemeContext = createContext(null);
  
  export function ThemeProvider({ children }) {
    // Ambil preferensi dari localStorage atau system
    const [theme, setTheme] = useState(() => {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    });
  
    // Sinkronkan ke <html class="dark"> + simpan ke localStorage
    useEffect(() => {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", theme);
    }, [theme]);
  
    // Opsional: ikuti perubahan preferensi OS jika user belum set manual
    useEffect(() => {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => {
        // Hanya auto-ubah jika user belum set manual (tidak diperlukan kalau kamu selalu hormati localStorage)
        const saved = localStorage.getItem("theme");
        if (!saved) setTheme(e.matches ? "dark" : "light");
      };
      if (mql.addEventListener) mql.addEventListener("change", handler);
      else mql.addListener(handler);
      return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else mql.removeListener(handler);
      };
    }, []);
  
    const value = useMemo(
      () => ({
        theme,
        setTheme,
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }),
      [theme]
    );
  
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  }
  
  export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
  }
  