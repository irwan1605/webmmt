// src/context/LanguageContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries } from "../i18n/dictionaries";

const STORAGE_KEY = "app:lang";
const Ctx = createContext(null);

function getInitialLang() {
  // 1) localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "id" || saved === "en") return saved;
  }
  // 2) <html lang="...">
  if (typeof document !== "undefined") {
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.startsWith("id")) return "id";
    if (htmlLang.startsWith("en")) return "en";
  }
  // 3) navigator
  if (typeof navigator !== "undefined") {
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("id")) return "id";
    if (nav.startsWith("en")) return "en";
  }
  return "id";
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  // Persist + update <html lang>
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== "undefined") document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  // Sync antar-tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === "id" || e.newValue === "en")) {
        setLang(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const t = useMemo(() => {
    return (key) => {
      const dict = dictionaries?.[lang];
      const val = dict ? getByPath(dict, key) : undefined;
      // TANPA fallback: wajib ada di kamus
      if (val == null) return `⟪missing:${lang}:${key}⟫`;
      return String(val);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider />");
  return ctx;
}
