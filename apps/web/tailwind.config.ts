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
        navy: {
          DEFAULT: '#003087',
          50: '#e5e9f2',
          100: '#ccd4e6',
          200: '#99a8cd',
          300: '#667db4',
          400: '#33529a',
          500: '#003087',
          600: '#00266c',
          700: '#001d51',
          800: '#001336',
          900: '#000a1b',
        },
        gold: {
          DEFAULT: '#C8860A',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
        serif: ['"Noto Serif"', 'serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
