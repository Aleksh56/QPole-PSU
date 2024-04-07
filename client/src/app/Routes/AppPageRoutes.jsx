import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AppPage from '@/components/03_Pages/App';
import ProfileAppPage from '@/components/03_Pages/App/pages/Profile';
import PolePage from '@/components/03_Pages/App/pages/PoleSettings';
import PolesArchivePage from '@/components/03_Pages/App/pages/Pole/PolesArchive';
import AppHeader from '@/components/04_Widgets/Navigation/Menus/appHeader';

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
          <Route path="tests/:id/*" element={<PolePage />} />
        </Route>

        <Route path="/profile/*" element={<ProfileAppPage />} />
      </Routes>
    </>
  );
};

export default AppPageRoutes;
