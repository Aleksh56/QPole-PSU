import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppPage from '@/pages/App';

const AppPageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
    </Routes>
  );
};

export default AppPageRoutes;
