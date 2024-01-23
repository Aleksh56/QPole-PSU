import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@app': '/src/app',
      '@routes': '/src/app/Routes',
      '@entities': '/src/entities',
      '@features': '/src/features',
      '@pages': '/src/pages',
      '@shared': '/src/shared',
      '@utils': '/src/utils',
      '@widgets': '/src/widgets',
      '@constants': '/src/constants',
      '@context': '/src/context',
      '@hooks': '/src/hooks',
    },
  },
});
