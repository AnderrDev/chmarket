import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '69d66bf4170c.ngrok-free.app' // dominio ngrok
    ],
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
