import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--bg-void)",
        "gradient-start": "var(--bg-gradient-start)",
        "gradient-end": "var(--bg-gradient-end)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-gold": "var(--accent-gold)",
        "ink-100": "var(--ink-100)",
        "ink-400": "var(--ink-400)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        'void-gradient': 'radial-gradient(circle at center, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
