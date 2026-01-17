// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sanmoto: {
          primary: "#16a34a",
          secondary: "#0f172a",
          accent: "#22c55e",
        },
      },
    },
  }
  ,
  plugins: [],
};


