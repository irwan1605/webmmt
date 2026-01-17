// src/pages/HomeDevInternal.jsx
import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import AboutDevInternal from "../components/AboutDevInternal.jsx";
import Services from "../components/Services.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import SANMOTOBackground from "../components/SANMOTOBackground.jsx";

export default function HomeDevInternal() {
  return (
    <div className="relative min-h-screen text-slate-900">
      <SANMOTOBackground
        imageUrl="/bg/sanmoto-bg.jpg"
        overlayOpacity={0.6}
      />

      <Header />
      <Hero />
      <AboutDevInternal />
      <FeatureGrid />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
