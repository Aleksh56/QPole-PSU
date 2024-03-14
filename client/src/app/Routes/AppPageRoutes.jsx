import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AppPage from '@/pages/App';
import ProfileAppPage from '@/pages/App/pages/Profile';
import PolePage from '@/pages/App/pages/PoleSettings';
import PolesArchivePage from '@/pages/App/pages/Pole/PolesArchive';
import AppHeader from '@/widgets/app/AppHeader';

const AppPageRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AppHeader />
              <Outlet />
            </>
          }
        >
          <Route index element={<AppPage />} />
          <Route path="polls-archive" element={<PolesArchivePage />} />
          <Route path="tests/stats/:id/*" element={'stats'} />
          <Route path="tests/:id/*" element={<PolePage />} />
        </Route>

        <Route path="/profile/*" element={<ProfileAppPage />} />
      </Routes>
    </>
  );
};

export default AppPageRoutes;
