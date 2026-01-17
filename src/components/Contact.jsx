// src/components/Contact.jsx
import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import ContactForm from "./ContactForm";

export default function Contact({
  companyName = "PT. Mila Media Telekomunikasi",
  address = "JL. Raya Cilangkap - Gg. Duri 3, Cimpaeun, Kec. Tapos, Kota Depok, Jawa Barat 16459",
  mapUrl = "https://maps.app.goo.gl/YcmsauVvqvi7ny4WA",
  mapEmbedUrl, // opsional: jika tak disediakan, dibuat otomatis dari address
  email = "admmilaphone@gmail.com",
  phone = "+62 815-1308-0380",


  // 🔧 Posisi marker dalam persen relatif ke kartu peta (default kira2 pusat)
  marker = { xPercent: 52, yPercent: 48 },
}) {
  const { t } = useLanguage();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const embedSrc = useMemo(() => {
    if (mapEmbedUrl) return mapEmbedUrl;
    const q = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [mapEmbedUrl, address]);

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - y) * 10;
    const ry = (x - 0.5) * 10;
    setTilt({ rx, ry, scale: 1.02 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
  }, []);

  const openMap = useCallback(() => {
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  }, [mapUrl]);

  const onKeyOpenMap = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMap();
      }
    },
    [openMap]
  );

  return (
    <section
      id="kontak"
      aria-label={t("contact.ariaSection", "Kontak Perusahaan")}
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="md:text-2xl text-sm uppercase tracking-widest text-slate-200 font-semibold text-center p-4">
        {t("contact.title", "KONTAK KAMI")}
      </div>

      {/* GRID: kiri kartu info, kanan peta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* --- Kartu info perusahaan (kiri) --- */}
        <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 md:p-8 text-slate-800 dark:text-slate-100 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            {t("contact.heading", "Hubungi Kami")}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {companyName}
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <div className="font-medium">
                  {t("contact.addressLabel", "Alamat")}
                </div>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  title={t(
                    "contact.openMapTitle",
                    "Buka lokasi di Google Maps"
                  )}
                >
                  {address}
                  <ExternalLink className="h-4 w-4 opacity-80" />
                </a>
               TOKO SANMOTO PUSAT ADA DI KOTA DEPOK - JAWA BARAT
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <div className="font-medium">Email</div>
                <a
                  href={`mailto:${email}`}
                  className="text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <div className="font-medium">
                  {t("contact.phoneLabel", "Telepon")}
                </div>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 text-white px-5 py-3 text-sm hover:bg-sky-400 transition"
              aria-label={t("contact.openGmailAria", "Buka Gmail")}
              title={t("contact.openGmailTitle", "Buka Gmail")}
            >
              {t("contact.sendEmailBtn", "Kirim Email")}
            </a>
          </div>
        </div>

        {/* --- Kartu peta interaktif + marker (kanan) --- */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={openMap}
          onKeyDown={onKeyOpenMap}
          role="button"
          tabIndex={0}
          aria-label={`${t(
            "contact.openMapAriaPrefix",
            "Buka lokasi"
          )} ${companyName} ${t("contact.onGoogleMaps", "di Google Maps")}`}
          title={t("contact.clickToOpenMap", "Klik untuk membuka Google Maps")}
          style={{
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
            transition: "transform 120ms ease",
            cursor: "pointer",
          }}
        >
          {/* Ring/glow di tepi saat hover */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 group-hover:ring-sky-400/40 transition" />

          {/* Preview Map */}
          <div className="relative aspect-[16/11] w-full">
            <iframe
              src={embedSrc}
              title={t("contact.mapPreviewTitle", "Google Maps Preview")}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ pointerEvents: "none", border: 0 }}
            />

            {/* ⬇️ Custom Marker Overlay + Animasi Ping */}
            <div
              className="absolute z-10"
              style={{
                left: `${marker.xPercent}%`,
                top: `${marker.yPercent}%`,
                transform: "translate(-50%, -100%)", // ujung pin menunjuk titik
              }}
            >
              {/* Ping ring */}
              <span className="absolute -inset-6 rounded-full bg-sky-400/30 animate-ping" />

              {/* Pin icon */}
              <div className="relative rounded-full bg-sky-500 shadow-lg shadow-sky-500/30 p-2 ring-2 ring-white/80 dark:ring-slate-900/80">
                <MapPin className="h-5 w-5 text-white drop-shadow" />
              </div>

              {/* Label muncul saat hover kartu */}
              <div
                className="
                  absolute left-1/2 -translate-x-1/2 mt-2
                  px-3 py-1.5 rounded-xl text-xs font-medium
                  bg-black/70 text-white shadow
                  opacity-0 group-hover:opacity-100 transition
                  whitespace-nowrap
                "
              >
                {companyName}
              </div>
            </div>
          </div>

          {/* Overlay info + tombol lihat peta */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center justify-between gap-3">
              <div className="text-white">
                <div className="text-xs opacity-80">
                  {t("contact.locationLabel", "Lokasi")}
                </div>
                <div className="font-semibold leading-tight">{address}</div>
              </div>
              <span
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-white/20 hover:bg-white/30
                  text-white px-3 py-2 text-xs sm:text-sm
                  transition
                "
              >
                {t("contact.viewInMaps", "Lihat di Maps")}
                <ExternalLink className="h-4 w-4" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- FORM di bawah grid --- */}
      <div className="mt-10 lg:mt-14">
        <ContactForm />
      </div>
    </section>
  );
}
