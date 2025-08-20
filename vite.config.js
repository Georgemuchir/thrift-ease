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
    minify: 'terser',
    rollupOptions: {
      output: {
        // Fixed naming for cache busting - render version
        entryFileNames: 'assets/[name]-render-[hash].js',
        chunkFileNames: 'assets/[name]-render-[hash].js',
        assetFileNames: 'assets/[name]-render-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      // Fix react-router resolution issues
      'react-router': 'react-router-dom'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  base: '/'
})
