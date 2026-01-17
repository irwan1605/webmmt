import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES_LAYANAN = [
  "PRODUK_1.png",
  "PRODUK_2.png",
  "PRODUK_3.png",
  "PRODUK_4.png",
];

export default function SlideLayanan() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % SLIDES_LAYANAN.length);
  }, []);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + SLIDES_LAYANAN.length) % SLIDES_LAYANAN.length);
  }, []);

  // AUTO PLAY
  useEffect(() => {
    if (paused) return;

    timerRef.current = setInterval(() => {
      next();
    }, 4000); // 4 detik

    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[260px] sm:h-[340px] lg:h-[420px]">

        {SLIDES_LAYANAN.map((file, i) => (
          <img
            key={file}
            src={`/slide-layanan/${file}`}
            alt={`Layanan ${i + 1}`}
            className={[
              "absolute inset-0 h-full w-full",
              "object-contain bg-black/10 p-4",
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

          {SLIDES_LAYANAN.map((_, i) => (
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
