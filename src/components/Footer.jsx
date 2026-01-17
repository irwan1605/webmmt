// src/components/Footer.jsx
import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600 dark:text-slate-300 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>
          © {year} {t("brand", "NAYA TECHNOLOGICAL INDONESIA")}.{" "}
          {t("footer.rights", "All rights reserved.")}
        </p>

        <div className="flex items-center gap-4">
          <a
            className="hover:text-slate-900 dark:hover:text-white"
            href="#tentang"
          >
            {t("footer.links.about", "About")}
          </a>
          <a
            className="hover:text-slate-900 dark:hover:text-white"
            href="#privacy"
          >
            {t("footer.links.privacy", "Privacy")}
          </a>
          <a
            className="hover:text-slate-900 dark:hover:text-white"
            href="#terms"
          >
            {t("footer.links.terms", "Terms")}
          </a>
        </div>
      </div>
    </footer>
  );
}
