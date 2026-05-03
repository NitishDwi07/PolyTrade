import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#080B12",
        panel: "#101521",
        mint: "#73FBD3",
        cobalt: "#5B7CFA",
        amber: "#FFCC66",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(91, 124, 250, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
