/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ob-base': '#0d0d0d', // фон страниц #0d0d0d
        'ob-surface': '#141414', // карточки #141414
        'ob-accent': '#d4c5a9', // золото #d4c5a9
        'ob-muted': '#6b6b6b', // второстепенный текст #6b6b6b
        'ob-border': '#2a2a2e', // бордеры #2a2a2e
        'ob-text': '#f0ede6' // основной текст #f0ede6
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      backdropBlur: {
        nav: '12px'
      }
    }
  },
  plugins: [],
}