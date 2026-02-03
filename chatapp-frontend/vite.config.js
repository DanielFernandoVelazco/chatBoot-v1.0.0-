import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esta línea soluciona el error de "global is not defined" en SockJS
    global: 'globalThis',
  },
})