module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  parser: '@babel/eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@assets', './src/assets'],
          ['@app', './src/app'],
          ['@api', './src/api'],
          ['@routes', './src/app/Routes'],
          ['@utils', './src/utils'],
          ['@hooks', './src/hooks'],
          ['@config', './src/config'],
          ['@constants', './src/constants'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  plugins: ['react', 'react-refresh', 'import'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-unused-vars': ['warn'],
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
};
