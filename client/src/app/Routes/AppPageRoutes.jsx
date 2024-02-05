import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppPage from '@/pages/App';
import ProfileAppPage from '@/pages/App/Profile';

const AppPageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/profile/*" element={<ProfileAppPage />} />
    </Routes>
  );
};

export default AppPageRoutes;
