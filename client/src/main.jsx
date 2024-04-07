import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/template/__init__.css';
import App from './App';
import { AuthProvider } from '@/app/context/AuthProvider';
import '@/locale/i18n';
import { AlertProvider } from './app/context/AlertProvider';
import AlertPopup from './components/04_Widgets/Utilities/Modals/alert';
import { UserRoleProvider } from './app/context/UserRoleProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AlertProvider>
    <AuthProvider>
      <UserRoleProvider>
        <AlertPopup />
        <App />
      </UserRoleProvider>
    </AuthProvider>
  </AlertProvider>
);
