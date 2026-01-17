// src/components/Services.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircuitBoard,
  PlugZap,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const PALETTES = [
  {
    from: "from-sky-500",
    to: "to-cyan-400",
    glow: "rgba(56,189,248,0.35)",
    ring: "shadow-[0_0_50px_-15px_rgba(56,189,248,0.55)]",
  },
  {
    from: "from-violet-500",
    to: "to-fuchsia-400",
    glow: "rgba(139,92,246,0.35)",
    ring: "shadow-[0_0_50px_-15px_rgba(139,92,246,0.55)]",
  },
  {
    from: "from-emerald-500",
    to: "to-lime-400",
    glow: "rgba(16,185,129,0.35)",
    ring: "shadow-[0_0_50px_-15px_rgba(16,185,129,0.55)]",
  },
];

// helper aman dari placeholder "⟪missing:…⟫"
const isMissing = (s) => typeof s === "string" && s.startsWith("⟪missing:");
const safe = (s) => (isMissing(s) ? "" : s);

export default function Services() {
  const { t } = useLanguage();

  // Susun isi card daftar (title/desc ditampilkan pada kartu)
  const CARDS = useMemo(
    () => [
      {
        key: "consult",
        icon: CircuitBoard,
        title: t("services.cards.consult.title", "Konsultasi & Arsitektur"),
        desc: t(
          "services.cards.consult.desc",
          "Audit kebutuhan, perancangan pipeline, dan PoC cepat."
        ),
      },
      {
        key: "sdk",
        icon: PlugZap,
        title: t("services.cards.sdk.title", "Integrasi & SDK"),
        desc: t(
          "services.cards.sdk.desc",
          "Integrasi kamera, CCTV, VMS, dan SDK untuk aplikasi Anda."
        ),
      },
      {
        key: "support",
        icon: LifeBuoy,
        title: t("services.cards.support.title", "Operasional & Support"),
        desc: t(
          "services.cards.support.desc",
          "Monitoring, pelatihan, dan SLA sesuai kebutuhan."
        ),
      },
    ],
    [t]
  );

  // Modal state
  const [openKey, setOpenKey] = useState(null);
  const current = CARDS.find((c) => c.key === openKey) || null;

  // Ambil konten modal detail dari kamus
  const getModalContent = useCallback(
    (key) => {
      if (!key) return { title: "", detail: "", bullets: [] };
      const title =
        safe(t(`services.cards.${key}.modalTitle`)) ||
        safe(t(`services.cards.${key}.title`));
      const detail =
        safe(t(`services.cards.${key}.detail`)) ||
        safe(t(`services.cards.${key}.desc`));
      const bullets = [];
      for (let i = 1; i <= 10; i++) {
        const b = safe(t(`services.cards.${key}.bullets.${i}`));
        if (b) bullets.push(b);
      }
      return { title, detail, bullets };
    },
    [t]
  );

  // Tutup modal via ESC
  const onEsc = useCallback((e) => {
    if (e.key === "Escape") setOpenKey(null);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onEsc]);

  // Focus trap + lock scroll ketika modal terbuka
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (!current) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const to = setTimeout(() => closeBtnRef.current?.focus(), 0);

    const handleTabTrap = (e) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabTrap);
    return () => {
      clearTimeout(to);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleTabTrap);
    };
  }, [current]);

  // Aksi "Hubungi Kami": tutup modal lalu scroll halus ke #kontak
  const goContact = useCallback(() => {
    setOpenKey(null);
    const el = document.getElementById("kontak");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#kontak";
    }
  }, []);

  return (
    <section
      id="layanan"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16"
    >
       <div className="md:text-2xl text-sm uppercase tracking-widest text-slate-200 font-semibold text-center p-4">
       {/* Slider mozaik di bawah kartu */}
       <SliderLayanan className="mt-10 lg:mt-14" />
       </div>
      <div className="md:text-2xl text-sm uppercase tracking-widest text-slate-200 font-semibold text-center p-4">
        {t("services.title", "LAYANAN KAMI")}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <ServiceCard
            key={card.key}
            card={card}
            index={i}
            onOpen={() => setOpenKey(card.key)}
          />
        ))}
      </div>

      {/* Modal detail layanan */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-title"
            onClick={() => setOpenKey(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* card */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/90 to-slate-800/90 text-slate-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="h-10 w-10 rounded-xl bg-white/5 grid place-items-center ring-1 ring-white/10 shadow-inner">
                  {current.icon ? (
                    <current.icon className="h-6 w-6 text-white/90" />
                  ) : null}
                </div>
                <h3 id="service-title" className="text-lg font-semibold">
                  {safe(getModalContent(current.key).title)}
                </h3>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpenKey(null)}
                  className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
                  aria-label={t("common.close", "Tutup")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* body */}
              <div className="p-5 space-y-4">
                {safe(getModalContent(current.key).detail) && (
                  <p className="leading-relaxed text-slate-200/90">
                    {safe(getModalContent(current.key).detail)}
                  </p>
                )}

                {getModalContent(current.key).bullets.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {getModalContent(current.key).bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-slate-100/95">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* garis putih tipis di atas tombol */}
              <div className="h-px w-full bg-white/10" />

              {/* actions */}
              <div className="p-5 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={goContact}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-white/5 px-4 py-2 text-sm text-sky-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {t("contact.contactUs", "Hubungi Kami")}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenKey(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 text-white px-4 py-2 text-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {t("common.close", "Tutup")}
                </button>
              </div>

              {/* glow frame */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 shadow-[0_0_60px_rgba(56,189,248,0.2)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

     
    </section>
  );
}

function ServiceCard({ card, index, onOpen }) {
  const palette = PALETTES[index % PALETTES.length];
  const ref = useRef(null);
  const Icon = card.icon;

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
      onClick={onOpen}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={[
        "text-left group relative overflow-hidden rounded-2xl border text-white",
        "border-white/10 bg-white/10 backdrop-blur p-6 shadow-sm",
        "transition-all duration-300 w-full",
      ].join(" ")}
      style={{
        background: `radial-gradient(600px circle at var(--mx, -100px) var(--my, -100px), ${palette.glow} 0%, transparent 60%)`,
        backgroundBlendMode: "screen",
      }}
      aria-label={card.title}
    >
      {/* Soft outer glow */}
      <div
        className={[
          "pointer-events-none absolute -inset-1 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300",
          "group-hover:opacity-100",
          palette.ring,
        ].join(" ")}
      />

      <div className="flex items-center gap-3">
        {/* Icon capsule gradient */}
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
            {/* ikon gelap agar kontras di dasar putih */}
            <Icon className="h-6 w-6 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-slate-900" />
          </div>
          <div
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background: `radial-gradient(120px circle at 50% 50%, ${palette.glow} 0%, transparent 70%)`,
            }}
          />
        </div>

        <h3 className="font-semibold">{card.title}</h3>
      </div>

      <p className="mt-2 text-sm">{card.desc}</p>

      {/* Border highlight tipis saat hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ borderColor: "rgba(255,255,255,0.25)" }}
      />
    </motion.button>
  );
}

/* ================== Slider Mozaik ================== */
function MosaicSlider({ className = "" }) {
  const { t } = useLanguage();

  const SLIDES = useMemo(
    () => [
      {
        id: "consult",
        src: "/slide/layanan1nti.png",
        title: t("services.cards.consult.title", "Konsultasi & Arsitektur"),
        caption: t(
          "services.slider.captions.consult",
          "Konsultasi & Arsitektur — Audit kebutuhan, rancang arsitektur, dan PoC cepat bersama tim ahli."
        ),
      },
      {
        id: "sdk",
        src: "/slide/layanan2nti.png",
        title: t("services.cards.sdk.title", "Integrasi & SDK"),
        caption: t(
          "services.slider.captions.sdk",
          "Integrasi & SDK — Integrasi kamera, CCTV/VMS, dan SDK lintas platform yang ringan."
        ),
      },
      {
        id: "support",
        src: "/slide/layanan3nti.png",
        title: t("services.cards.support.title", "Operasional & Support"),
        caption: t(
          "services.slider.captions.support",
          "Operasional & Support — Monitoring, pelatihan, dan SLA fleksibel sesuai kebutuhan."
        ),
      },
    ],
    [t]
  );

  const ROWS = 8;
  const COLS = 14;
  const DURATION = 0.6;
  const STAGGER = 0.012;
  const AUTO_MS = 3500;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setIdx((i) => (i + 1) % SLIDES.length),
    [SLIDES.length]
  );
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    [SLIDES.length]
  );

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    timerRef.current = setInterval(next, AUTO_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, next, SLIDES.length]);

  const center = { r: (ROWS - 1) / 2, c: (COLS - 1) / 2 };

  return (
    <div className={["group", className].join(" ")}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-white/90">
          {t("services.slider.title", "Konsultasi • Integrasi • Operasional")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-full bg-white/60 hover:bg-white/90 text-slate-800 p-2 transition shadow"
            aria-label={t("services.slider.prev", "Sebelumnya")}
            title={t("services.slider.prev", "Sebelumnya")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-white/60 hover:bg-white/90 text-slate-800 p-2 transition shadow"
            aria-label={t("services.slider.next", "Berikutnya")}
            title={t("services.slider.next", "Berikutnya")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 backdrop-blur"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[16/9] w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={SLIDES[idx].id}
              className="absolute inset-0"
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                }}
              >
                {Array.from({ length: ROWS }).map((_, r) =>
                  Array.from({ length: COLS }).map((__, c) => {
                    const dist = Math.hypot(r - center.r, c - center.c);
                    const delay = dist * 0.012;
                    const bgPosX = (c / (COLS - 1)) * 100;
                    const bgPosY = (r / (ROWS - 1)) * 100;

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, rotate: -2 },
                          show: {
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            transition: { duration: 0.6, delay },
                          },
                        }}
                        style={{
                          backgroundImage: `url(${SLIDES[idx].src})`,
                          backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                        }}
                        className="relative"
                      />
                    );
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Overlay judul + caption slide aktif */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/55 to-transparent">
            <div className="text-white text-sm sm:text-base font-semibold">
              {SLIDES[idx].title}
            </div>
            <div className="text-white/90 text-xs sm:text-sm mt-1">
              {SLIDES[idx].caption}
            </div>
          </div>

          {/* Controls saat hover */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={prev}
              className="pointer-events-auto m-2 rounded-full bg-black/35 hover:bg-black/55 text-white p-2"
              aria-label={t("services.slider.prev", "Sebelumnya")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="pointer-events-auto m-2 rounded-full bg-black/35 hover:bg-black/55 text-white p-2"
              aria-label={t("services.slider.next", "Berikutnya")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 py-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80",
              ].join(" ")}
              aria-label={`${t("about.gotoSlide", "Ke slide")} ${i + 1}`}
              title={`${t("about.slide", "Slide")} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================== SLIDER LAYANAN ================== */
function SliderLayanan({ className = "" }) {
  const images = Object.values(
    import.meta.glob("/public/slide-layanan/*.{png,jpg,jpeg,webp}", {
      eager: true,
    })
  ).map((m) => m.default);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (paused || images.length <= 1) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, next, images.length]);

  if (!images.length) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[260px] sm:h-[340px] lg:h-[420px]">

        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Layanan ${i + 1}`}
            className={[
              "absolute inset-0 h-full w-full",
              "object-contain p-4",
              "transition-opacity duration-700",
              i === idx ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}

        {/* BUTTON */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 
          bg-white/80 p-2 rounded-full shadow hover:bg-white"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 
          bg-white/80 p-2 rounded-full shadow hover:bg-white"
        >
          <ChevronRight />
        </button>

        {/* DOT */}
        <div className="absolute bottom-4 left-1/2 
        -translate-x-1/2 flex gap-2">

          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2.5 w-2.5 rounded-full 
              ${i === idx ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

