import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  // Preflight is disabled so Tailwind utilities don't clobber the existing
  // custom design system in app/globals.css.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--text)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--text)',
        },
        border: 'var(--border)',
        input: 'var(--surface-2)',
        ring: 'var(--primary)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--btn-primary-text)',
        },
        secondary: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--btn-primary-text)',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
