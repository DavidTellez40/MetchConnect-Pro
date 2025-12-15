import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 🚨 AÑADE ESTA LÍNEA CLAVE 🚨
  base: './', 
  plugins: [react()],
})