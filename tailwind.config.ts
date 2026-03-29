import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme palette (matches globals.css)
        background: '#fdf8f3',
        surface: '#ffffff',
        'surface-muted': '#f7f1ea',
        border: '#e6d9c8',
        foreground: '#1f2937',
        muted: '#475569',
        accent: '#f59e0b',
        'accent-strong': '#d97706',

        // Legacy keys for backward compatibility
        primary: {
          DEFAULT: '#ffffff',
        },
        dark: {
          DEFAULT: '#151515',
        },
        light: {
          DEFAULT: '#ffffff',
        },
      },
      boxShadow: {
        card: '0 10px 30px -20px rgba(30, 41, 59, 0.35)',
      },
    },
  },
  plugins: [],
}

export default config