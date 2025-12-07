/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark blue theme palette matching Home page
        background: '#0f1a2e',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#1a2d4a',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#0f1a2e',
        },
        secondary: {
          DEFAULT: '#243b5c',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#5a8fd4',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1e3a5f',
          foreground: '#94a3b8',
        },
        border: '#2a4266',
        input: '#243b5c',
        ring: '#5a8fd4',
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#5a8fd4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
