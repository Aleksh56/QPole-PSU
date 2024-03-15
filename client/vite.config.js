import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [{ src: 'scripts/start.js', dest: 'dist' }],
      hook: 'writeBundle', // используйте этот хук для копирования после сборки
    }),
  ],
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
      '@config': '/src/config',
    },
  },
});
