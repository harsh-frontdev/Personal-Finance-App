/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        body: '#f8f9fc',
        sidebar: '#ffffff',
        card: {
          DEFAULT: '#ffffff',
          alt: '#f0f3fa',
        },
        hero: '#06402b',
        tip: '#094732',
        main: '#1e293b',
        muted: '#64748b',
        light: '#94a3b8',
        'hero-label': '#a2c6b6',
        primary: {
          DEFAULT: '#2B6954',
          hover: '#085237',
        },
        accent: '#22c55e',
        danger: '#BA1A1A',
        border: '#e2e8f0',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #06402b 0%, #032b1c 100%)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
