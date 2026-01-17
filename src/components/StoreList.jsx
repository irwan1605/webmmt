// src/components/StoreList.jsx
import React from "react";

const stores = [
  "SANMOTO Metland",
  "SANMOTO Ciracas",
  "SANMOTO Citeureup",
  "SANMOTO Margonda",
  "SANMOTO Kota Wisata",
];

export default function StoreList() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">
          Cabang Kami
        </h2>

        <ul className="grid md:grid-cols-2 gap-4">
          {stores.map((s, i) => (
            <li
              key={i}
              className="bg-white p-5 rounded-xl shadow"
            >
              📍 {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
