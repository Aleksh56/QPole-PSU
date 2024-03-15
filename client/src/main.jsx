import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/template/__init__.css';
import App from './App';
import { AuthProvider } from '@/app/context/AuthProvider';
import '@/locale/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
