import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Ensures React Router works with Vite
    proxy: {
      '/api': 'http://localhost:5000', // Replace with your backend URL for development
    },
  },
  preview: {
    historyApiFallback: true, // Ensures React Router works in preview mode
  },
  build: {
    outDir: 'dist',
  },
});
