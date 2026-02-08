import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    strictPort: true,
    // WebSocket stability ke liye HMR settings
    hmr: {
      overlay: false, 
    },
    // Backend connection ke liye proxy (Optional but recommended for local dev)
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Production build optimization
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  }
})