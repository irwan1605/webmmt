// src/components/FeatureGrid.jsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MonitorSmartphone,
  LineChart,
  ShieldCheck,
  BadgeCheck,
  Cpu,
  X,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const PALETTES = [
  { from: "from-sky-500", to: "to-cyan-400", glow: "rgba(56,189,248,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(56,189,248,0.6)]" },
  { from: "from-violet-500", to: "to-fuchsia-400", glow: "rgba(139,92,246,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(139,92,246,0.6)]" },
  { from: "from-emerald-500", to: "to-lime-400", glow: "rgba(16,185,129,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(16,185,129,0.55)]" },
  { from: "from-amber-500", to: "to-orange-400", glow: "rgba(245,158,11,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(245,158,11,0.55)]" },
  { from: "from-rose-500", to: "to-pink-400", glow: "rgba(244,63,94,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(244,63,94,0.55)]" },
  { from: "from-indigo-500", to: "to-purple-400", glow: "rgba(99,102,241,0.35)", ring: "shadow-[0_0_50px_-15px_rgba(99,102,241,0.55)]" },
];

// Mapping kunci → ikon (sinkron dengan dictionaries.js → features.items.*)
const FEATURE_KEYS = [
  { key: "camera", icon: Camera },
  { key: "monitorsmartphone", icon: MonitorSmartphone },
  { key: "linechart", icon: LineChart },
  { key: "security", icon: ShieldCheck },
  { key: "accuracy", icon: BadgeCheck },
  { key: "speed", icon: Cpu },
];

// helper untuk aman dari placeholder "⟪missing:…⟫"
const isMissing = (s) => typeof s === "string" && s.startsWith("⟪missing:");
const safe = (s) => (isMissing(s) ? "" : s);

export default function FeatureGrid() {
  const { t } = useLanguage();
  const [openKey, setOpenKey] = useState(null);

  // Tutup modal via ESC
  const onEsc = useCallback((e) => {
    if (e.key === "Escape") setOpenKey(null);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onEsc]);

  // Ambil konten untuk modal berdasarkan key
  const getModalContent = (key) => {
    const title =
      safe(t(`features.items.${key}.modalTitle`)) ||
      safe(t(`features.items.${key}.title`));
    const detail =
      safe(t(`features.items.${key}.detail`)) ||
      safe(t(`features.items.${key}.desc`));

    // Bullet numerik 1..8 (opsional)
    const bullets = [];
    for (let i = 1; i <= 8; i++) {
      const b = safe(t(`features.items.${key}.bullets.${i}`));
      if (b) bullets.push(b);
    }
    return { title, detail, bullets };
  };

  return (
    <section
      id="fitur"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16"
    >
      <div className="md:text-2xl text-sm uppercase tracking-widest text-slate-200 font-semibold text-center p-4">
        {t("features.title")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_KEYS.map(({ key, icon: Icon }, i) => (
          <FeatureCard
            key={key}
            index={i}
            Icon={Icon}
            title={t(`features.items.${key}.title`)}
            desc={t(`features.items.${key}.desc`)}
            onOpen={() => setOpenKey(key)}
          />
        ))}
      </div>

      {/* Modal (popup) detail fitur */}
      <AnimatePresence>
        {openKey && (
          <Modal onClose={() => setOpenKey(null)}>
            <ModalContent
              icon={FEATURE_KEYS.find((f) => f.key === openKey)?.icon}
              title={getModalContent(openKey).title}
              detail={getModalContent(openKey).detail}
              bullets={getModalContent(openKey).bullets}
              onClose={() => setOpenKey(null)}
              onContact={() => {
                // Tutup modal, lalu scroll mulus ke section KONTAK KAMI
                setOpenKey(null);
                const el = document.getElementById("kontak");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  // fallback: set hash agar pindah halaman/anchor
                  window.location.hash = "#kontak";
                }
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

function FeatureCard({ index, Icon, title, desc, onOpen }) {
  const palette = PALETTES[index % PALETTES.length];
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };

  return (
    <motion.button
      type="button"
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={[
        "group relative overflow-hidden rounded-2xl border text-white text-left",
        "border-white/10 bg-white/10 backdrop-blur p-5 shadow-sm",
        "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/70",
      ].join(" ")}
      style={{
        background: `radial-gradient(600px circle at var(--mx, -100px) var(--my, -100px), ${palette.glow} 0%, transparent 60%)`,
        backgroundBlendMode: "screen",
      }}
      aria-label={safe(title) || "Feature"}
    >
      {/* Glow ring lembut saat hover */}
      <div
        className={[
          "pointer-events-none absolute -inset-1 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300",
          "group-hover:opacity-100",
          palette.ring,
        ].join(" ")}
      />

      <div className="flex items-center gap-3">
        {/* Icon capsule */}
        <div
          className={[
            "relative h-12 w-12 rounded-2xl p-[2px]",
            "bg-gradient-to-br",
            palette.from,
            palette.to,
            "transition-transform duration-300",
            "group-hover:scale-105 group-hover:rotate-1",
          ].join(" ")}
        >
          <div className="grid h-full w-full place-items-center rounded-2xl bg-white">
            <Icon className="h-6 w-6 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-slate-900" />
          </div>
          <div
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background: `radial-gradient(120px circle at 50% 50%, ${palette.glow} 0%, transparent 70%)`,
            }}
          />
        </div>

        <h3 className="font-semibold">{safe(title)}</h3>
      </div>

      <p className="mt-3 text-sm">{safe(desc)}</p>

      {/* Border highlight tipis saat hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ borderColor: "rgba(255,255,255,0.25)" }}
      />
    </motion.button>
  );
}

/* ---------------- Modal Wrapper ---------------- */
function Modal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      {children}
    </motion.div>
  );
}

/* ---------------- Modal Content ---------------- */
function ModalContent({ icon: Icon, title, detail, bullets = [], onClose, onContact }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-10 w-full max-w-xl rounded-2xl border border-white/15
                 bg-gradient-to-b from-slate-900/90 to-slate-800/90 text-slate-100 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center ring-1 ring-white/10 shadow-inner">
          {Icon ? <Icon className="h-6 w-6 text-sky-300" /> : null}
        </div>
        <h3 className="text-lg font-semibold">{safe(title)}</h3>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
          aria-label={t("common.close", "Tutup")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {safe(detail) && (
          <p className="leading-relaxed text-slate-200/90">{safe(detail)}</p>
        )}

        {bullets.length > 0 && (
          <ul className="mt-2 space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-slate-100/95">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Garis putih tipis di atas tombol */}
      <div className="h-px w-full bg-white/20" />

      {/* Tombol aksi */}
      <div className="p-5 pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onContact}
          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-white/5 px-4 py-2 text-sm text-sky-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {t("contact.contactUs", "Hubungi Kami")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 text-white px-4 py-2 text-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {t("common.close", "Tutup")}
        </button>
      </div>

      {/* Glow frame */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 shadow-[0_0_60px_rgba(56,189,248,0.2)]" />
    </motion.div>
  );
}
