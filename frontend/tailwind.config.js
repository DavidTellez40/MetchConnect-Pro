// frontend/tailwind.config.js - VERSIÓN CORREGIDA Y COMPLETA

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // VITAL: La palabra 'colors' debe estar aquí.
      colors: {
        'brown': { // Tu nueva variable de color principal
          50: '#fdf7f3',
          // ... el resto de tus tonos café
          500: '#c29070', 
          // ...
          950: '#381f11',
        },
        'burnt-yellow': { // Tu nueva variable de color secundario
          50: '#fffdf4',
          // ... el resto de tus tonos amarillo quemado
          500: '#ffd344', 
          // ...
          950: '#4f3912',
        }
      }
    },
  },
  plugins: [],
}