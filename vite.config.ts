import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/swagger': {
        target: 'http://127.0.0.1:5245',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:5245',
        changeOrigin: true,
      },
      '/hubs': {
        target: 'http://127.0.0.1:5245',
        ws: true,
        changeOrigin: true,
      },
      '/openapi': {
        target: 'http://127.0.0.1:5245',
        changeOrigin: true,
      },
    },
  },
})
