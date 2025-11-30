/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          foreground: '#f8fafc', // Slate 50
        },
        secondary: {
          DEFAULT: '#f1f5f9', // Slate 100
          foreground: '#0f172a', // Slate 900
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue 500
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#64748b', // Slate 500
          foreground: '#f1f5f9',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        background: '#f8fafc', // Slate 50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
