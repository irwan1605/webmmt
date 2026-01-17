// src/lib/constants.js
// Kompatibel dengan kode lama (NAV/FEATURES sebagai konstanta),
// sekaligus menyediakan builder i18n getNav(t) & getFeatures(t).

import {
    Camera,
    MonitorSmartphone,
    LineChart,
    ShieldCheck,
    BadgeCheck,
    Cpu,
  } from "lucide-react";
  
  import { dictionaries } from "../i18n/dictionaries";
  
  // ---------- Backward-compatible exports (langsung jalan) ----------
  export const NAV = [
    { id: "beranda", label: "Beranda" },
    { id: "tentang", label: "Tentang" },
    { id: "fitur",   label: "Fitur" },
    { id: "layanan", label: "Layanan" },
    { id: "kontak",  label: "Kontak" },
  ];
  
  export const FEATURES = [
    {
      icon: Camera,
      title: "Perangkat (device/sensor/board) ",
      desc: "Pengadaan perangkat lunak (firmware, aplikasi, cloud/API).",
    },
    {
      icon: MonitorSmartphone,
      title: "mengoperasikan R&D dan Manufaktur",
      desc: "SDK ringan untuk desktop & mobile.",
    },
    {
      icon: LineChart,
      title: "Distribusi dan Pemasaran",
      desc: "Pencarian individu dari arsip media.",
    },
    {
      icon: ShieldCheck,
      title: "Keamanan & Privasi",
      desc: "Enkripsi & kontrol akses berjenjang.",
    },
    {
      icon: BadgeCheck,
      title: "Akurasi Terverifikasi",
      desc: "Metrik FMR/TPR transparan.",
    },
    {
      icon: Cpu,
      title: "Optimasi Edge",
      desc: "Cepat & hemat daya di edge devices.",
    },
  ];
  
  // ---------- Helper i18n ringan (tanpa pakai context) ----------
  function getCurrentLang() {
    try {
      const ls = localStorage.getItem("app:lang");
      if (ls === "id" || ls === "en") return ls;
    } catch {}
    const html = typeof document !== "undefined" ? (document.documentElement.lang || "").toLowerCase() : "";
    if (html.startsWith("en")) return "en";
    if (html.startsWith("id")) return "id";
    return "id";
  }
  
  function pick(dict, path) {
    return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), dict);
  }
  
  // ---------- Builder i18n (rekomendasi untuk migrasi bertahap) ----------
  export function getNav(t) {
    // gunakan t dari LanguageContext
    return [
      { id: "beranda", label: t("nav.home") },
      { id: "tentang", label: t("nav.about") },
      { id: "fitur",   label: t("nav.features") },
      { id: "layanan", label: t("nav.services") },
      { id: "kontak",  label: t("nav.contact") },
    ];
  }
  
  /**
   * getFeatures(t) mencoba 6 item dahulu (device/rnd/distribution/security/accuracy/edge).
   * Jika kamus tidak punya semua itu, fallback ke 3 item (accuracy/security/speed).
   */
  export function getFeatures(t) {
    const lang = getCurrentLang();
    const dict = dictionaries?.[lang] || {};
  
    const has6 =
      !!pick(dict, "features.items.device.title") &&
      !!pick(dict, "features.items.rnd.title") &&
      !!pick(dict, "features.items.distribution.title") &&
      !!pick(dict, "features.items.security.title") &&
      !!pick(dict, "features.items.accuracy.title") &&
      !!pick(dict, "features.items.edge.title");
  
    if (has6) {
      return [
        {
          icon: Camera,
          title: t("features.items.device.title"),
          desc:  t("features.items.device.desc"),
        },
        {
          icon: MonitorSmartphone,
          title: t("features.items.rnd.title"),
          desc:  t("features.items.rnd.desc"),
        },
        {
          icon: LineChart,
          title: t("features.items.distribution.title"),
          desc:  t("features.items.distribution.desc"),
        },
        {
          icon: ShieldCheck,
          title: t("features.items.security.title"),
          desc:  t("features.items.security.desc"),
        },
        {
          icon: BadgeCheck,
          title: t("features.items.accuracy.title"),
          desc:  t("features.items.accuracy.desc"),
        },
        {
          icon: Cpu,
          title: t("features.items.edge.title"),
          desc:  t("features.items.edge.desc"),
        },
      ];
    }
  
    // fallback ke 3 item sesuai kamus yang kamu kirim
    return [
      {
        icon: BadgeCheck,
        title: t("features.items.accuracy.title"),
        desc:  t("features.items.accuracy.desc"),
      },
      {
        icon: ShieldCheck,
        title: t("features.items.security.title"),
        desc:  t("features.items.security.desc"),
      },
      {
        icon: LineChart,
        title: t("features.items.speed.title"),
        desc:  t("features.items.speed.desc"),
      },
    ];
  }
  