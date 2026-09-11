import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { authApiPlugin } from './server/apiMiddleware.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), authApiPlugin()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    watch: {
      ignored: ['**/*.md', '**/node_modules/**', '**/.git/**']
    }
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true
  }
});
