import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import { babel } from '@rollup/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Handles JSX, Fast Refresh
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'cjs'],
      presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
            useESModules: true,
          },
        ],
      ],
    }),
    copy({
      targets: [{ src: 'scripts/start.js', dest: 'dist' }],
      hook: 'writeBundle',
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
