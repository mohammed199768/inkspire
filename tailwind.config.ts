import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                inkspirePurple: '#201037', // Accent
                inkspireIndigo: '#0d0e22', // Deep
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-outfit)', 'sans-serif'],
            },
            // --- Sci-Fi Animation Systems ---
            animation: {
                'scanline': 'scanline 8s linear infinite',
                'spin-slow': 'spin 12s linear infinite',
                'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
                'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(500%)' },
                },
                'pulse-neon': {
                    '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(168,85,247,0.5))' },
                    '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.8))' },
                },
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            },
            // --- End of Sci-Fi Additions ---
        },
    },
    plugins: [],
};
export default config;