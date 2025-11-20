import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // components and pages are at project root, so alias '@' -> project root
      '@': path.resolve(__dirname, '.')
    }
  }
});