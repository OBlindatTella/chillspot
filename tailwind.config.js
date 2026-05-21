/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e6ede6',
          200: '#ccdccc',
          300: '#a8c4a8',
          400: '#7da67d',
          500: '#5c8a5c',
          600: '#476e47',
          700: '#3a593a',
          800: '#304730',
          900: '#283c28',
        },
        night: {
          50:  '#eef2f7',
          100: '#dae3ef',
          200: '#b8cade',
          300: '#8ca9c8',
          400: '#6488b2',
          500: '#476da0',
          600: '#375685',
          700: '#2e456c',
          800: '#293b5a',
          900: '#26334d',
        },
        warm: {
          50:  '#faf8f4',
          100: '#f4efe6',
          200: '#e9ddcc',
          300: '#dac7a8',
          400: '#c9ad82',
          500: '#bb9660',
          600: '#ae824d',
          700: '#916b41',
          800: '#765738',
          900: '#614830',
        },
        dark: {
          900: '#0d1117',
          800: '#141b24',
          700: '#1c2633',
          600: '#243040',
          500: '#2e3d50',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.08)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.12)',
        'glow-sage': '0 0 20px rgba(92,138,92,0.3)',
        'glow-night': '0 0 20px rgba(71,109,160,0.3)',
        'card': '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
