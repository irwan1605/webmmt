// src/components/SANMOTOBackground.jsx
import React from "react";

export default function SANMOTOBackground({
  imageUrl,
  overlayOpacity = 0.6,
}) {
  return (
    <div
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
