import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppPage from '@/pages/App';
import ProfileAppPage from '@/pages/App/pages/Profile';
import PolePage from '@/pages/App/pages/PoleSettings';
import PolesArchivePage from '@/pages/App/pages/Pole/PolesArchive';

const AppPageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/polls-archive" element={<PolesArchivePage />} />
      <Route path="/profile/*" element={<ProfileAppPage />} />
      <Route path="/tests/stats/:id/*" element={'stats'} />
      <Route path="/tests/:id/*" element={<PolePage />} />
    </Routes>
  );
};

export default AppPageRoutes;
