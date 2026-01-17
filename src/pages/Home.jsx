// src/pages/Home.jsx
import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

// background baru
import SANMOTOBackground from "../components/SANMOTOBackground.jsx";

export default function Home() {
  return (
    <div className="relative min-h-screen text-slate-900">
      {/* Background otomotif */}
      <SANMOTOBackground
        imageUrl="/bg/sanmoto-bg.jpg"
        overlayOpacity={0.6}
      />

      <Header />
      <Hero />
      <About />
      <FeatureGrid />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
