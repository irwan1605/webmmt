// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";


// Jika kamu sudah punya LanguageProvider (dan ThemeProvider), tetap bungkus di sini.
import { LanguageProvider } from "./context/LanguageContext.jsx";
import HomeDevInternal from "./pages/HomeDevInternal.jsx";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Rute tersembunyi: semua halaman sama, About diganti versi internal */}
          <Route path="/dev" element={<HomeDevInternal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
