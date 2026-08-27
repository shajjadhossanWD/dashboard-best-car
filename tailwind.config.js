/** @type {import('tailwindcss').Config} */

/**
 * Design tokens live here, not in component files.
 * Every colour used by the UI is reachable through a semantic name so a rebrand
 * is a single-file change.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        brand: {
          50: '#FFF6EC',
          100: '#FFF1E0',
          200: '#FFD9AE',
          300: '#FFBB6E',
          400: '#FFAA55',
          500: '#FF9F43',
          600: '#F58220',
          700: '#E8801F',
          800: '#B85D0B',
          900: '#8A4508',
        },
        navy: {
          50: '#F1F5F9',
          100: '#DBE4EE',
          400: '#274C6E',
          500: '#123A5E',
          600: '#0E3253',
          700: '#092C4C',
          800: '#06223B',
          900: '#04182A',
        },
        ink: {
          DEFAULT: '#212B36',
          muted: '#67748E',
          soft: '#9BA5B7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          sunken: '#F7F7F9',
          raised: '#FBFBFC',
        },
        line: {
          DEFAULT: '#E8EBED',
          strong: '#D5D9DD',
        },
        success: { DEFAULT: '#28C76F', soft: '#E4F8ED' },
        danger: { DEFAULT: '#EA5455', soft: '#FDECEC' },
        info: { DEFAULT: '#00A3E0', soft: '#E3F4FC' },
        warning: { DEFAULT: '#FF9F43', soft: '#FFF3E6' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        card: '0 4px 24px -12px rgba(18, 38, 63, 0.12)',
        popover: '0 12px 32px -8px rgba(18, 38, 63, 0.20)',
        rail: '4px 0 24px -20px rgba(18, 38, 63, 0.35)',
      },
      borderRadius: {
        card: '0.625rem',
      },
      spacing: {
        sidebar: '15.5rem',
        'sidebar-sm': '4.75rem',
        topbar: '4rem',
      },
      zIndex: {
        sidebar: '40',
        topbar: '30',
        overlay: '35',
        popover: '50',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
