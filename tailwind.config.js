// 1. Reemplaza el contenido de tu archivo: tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // Asegúrate que esta línea esté correcta
  ],
  theme: {
    extend: {
      // AQUÍ ESTÁ LA MAGIA: Le enseñamos nuestros colores a Tailwind
      colors: {
        'cyber-dark': '#111827',
        'cyber-primary': '#6366F1',
        'cyber-secondary': '#818CF8',
        'cyber-accent': '#FFFFFF',
        'cyber-text': '#F9FAFB',
        'cyber-text-secondary': '#D1D5DB'
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.8s ease-out',
        'fade-in': 'fadeIn 1s ease-out'
      }
    },
  },
  plugins: [],
}
