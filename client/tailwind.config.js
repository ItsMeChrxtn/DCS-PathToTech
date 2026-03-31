/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Segoe UI"', 'sans-serif'],
        display: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        maroon: "#800000",
        "maroon-light": "#991a1a",
        "maroon-dark": "#660000",
        wine: "#5c1111",
        parchment: "#fffaf4",
        ink: "#231f20",
        fog: "#f4f1ee",
      },
      spacing: {
        128: "32rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        elegant: "0 10px 30px rgba(35, 31, 32, 0.08)",
        premium: "0 24px 60px rgba(92, 17, 17, 0.14)",
      },
    },
  },
  plugins: [],
};
