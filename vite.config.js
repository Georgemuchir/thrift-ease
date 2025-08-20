import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 10000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // FINAL NUCLEAR CACHE BUST
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Force new build hashes
        entryFileNames: `assets/[name]-[hash]-final.js`,
        chunkFileNames: `assets/[name]-[hash]-final.js`,
        assetFileNames: `assets/[name]-[hash]-final.[ext]`
      }
    }
  },
  base: '/'
})
