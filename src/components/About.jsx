// src/components/About.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const SLIDES = [
  // Letak file: public/slide/<nama file>
  "logo_depan_ruangan.jpg",
  "Coffe_break1.jpg",
  "ruang_depan3.jpg",
  "ruang_depan1.jpg",
  "ruang_kerja_admin2.jpg",
  "ruang_rapat2.jpg",
  "ruang_rapat4.jpg",
  "ruang_rapat5.jpg",
  "ruang_rapat8.jpg",
  "ruang_rapat10.jpg",
];

export default function About() {
  const { t } = useLanguage();

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % SLIDES.length);
  }, []);
  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    timerRef.current = setInterval(next, 5000); // 2 detik
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  return (
    <section
      id="tentang"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-16"
    >
      <div className="md:text-2xl text-sm uppercase tracking-widest text-slate-200 font-semibold text-center p-4">
        {t("about.title")}
      </div>

      {/* Card deskripsi */}
      <div className="text-white rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-20 to-sky-50 p-6 lg:p-10">
        <h2 className="text-xl md:text-2xl text-center font-bold">
          {t("about.companyTitle")}
        </h2>

        <p className="mx-auto p-4 mt-4 text-center text-slate-800 leading-relaxed md:text-xl max-w-4xl text-white">
          {t("about.body")}
        </p>

        <div
          className="group relative mb-6 p-4 overflow-hidden rounded-3xl border border-white/10 bg-black/10 backdrop-blur"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-label={t("about.galleryAria")}
        >
          {/* Track images */}
          <div className="relative h-[220px] sm:h-[300px] lg:h-[380px]">
            {SLIDES.map((file, i) => (
              <img
                key={file}
                src={`/slide/${file}`}
                alt={`${t("about.slide")} ${i + 1}`}
                className={[
                  "absolute inset-0 h-full w-full object-cover",
                  "transition-opacity duration-700 ease-out",
                  i === idx ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onError={(e) => {
                  // kalau gambar belum ada, biar gak jelek
                  e.currentTarget.style.opacity = 0.2;
                }}
              />
            ))}

            {/* overlay gradient untuk kontras */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Controls kiri/kanan (muncul saat hover) */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
            aria-label={t("about.prev")}
            title={t("about.prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
            aria-label={t("about.next")}
            title={t("about.next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80",
                ].join(" ")}
                aria-label={`${t("about.gotoSlide")} ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
