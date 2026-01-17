// src/components/ProductGrid.jsx
import React from "react";

const products = [
  {
    name: "Uwinfly T3",
    price: "Rp 15.500.000",
    img: "/motor/uwinfly.png",
  },
  {
    name: "E-Nine V3",
    price: "Rp 14.200.000",
    img: "/motor/enine.png",
  },
  {
    name: "Ofero Stareer",
    price: "Rp 17.800.000",
    img: "/motor/ofero.png",
  },
];

export default function ProductGrid() {
  return (
    <section id="features" className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">
          Produk Unggulan
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={p.img}
                alt={p.name}
                className="h-56 w-full object-contain p-4"
              />

              <div className="p-6">
                <h3 className="font-bold text-lg">
                  {p.name}
                </h3>

                <p className="text-sanmoto-primary font-semibold mt-2">
                  {p.price}
                </p>

                <a
                  href="#contact"
                  className="block text-center mt-4 bg-sanmoto-primary text-white py-2 rounded-xl"
                >
                  Pesan Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


