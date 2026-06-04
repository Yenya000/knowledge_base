/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obl': {
          'base': 'var(--bg-base)',
          'surface': 'var(--bg-surface)',
          'elevated': 'var(--bg-elevated)',
          'nav': 'var(--bg-nav)',
          'accent': 'var(--accent)',
          'accent-dim': 'var(--accent-dim)',
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'muted': 'var(--text-muted)',
          'faint': 'var(--text-faint)',
          'border-subtle': 'var(--border-subtle)',
          'border-default': 'var(--border-default)',
          'border-accent': 'var(--border-accent)',
        }
      },
      // Переопределяем шрифты 
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Настраиваем скругления
      borderRadius: {
        'obl-sm': 'var(--radius-sm)',
        'obl-md': 'var(--radius-md)',
        'obl-lg': 'var(--radius-lg)',
        'obl-pill': 'var(--radius-pill)',
      },
      // Базовая сетка отступов (Твои space- токены)
      spacing: {
        'obl-1': 'var(--space-1)',
        'obl-2': 'var(--space-2)',
        'obl-3': 'var(--space-3)',
        'obl-4': 'var(--space-4)',
        'obl-5': 'var(--space-5)',
        'obl-6': 'var(--space-6)',
        'obl-8': 'var(--space-8)',
        'obl-10': 'var(--space-10)',
        'obl-12': 'var(--space-12)',
      }
    },
  },
  plugins: [],
}