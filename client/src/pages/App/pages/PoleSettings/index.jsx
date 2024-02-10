import React from 'react';
import AppHeader from '@/widgets/AppHeader';
import { Routes, Route } from 'react-router-dom';
import PoleSettingsMenuNavigation from '@/features/PoleSettingsMenuNavigation';
import { poleNavigationButtonsData } from './data/PoleNavigationButtonsData';

const PolePage = () => {
  return (
    <>
      <AppHeader />
      <PoleSettingsMenuNavigation buttons={poleNavigationButtonsData} />
      <Routes>
        {poleNavigationButtonsData.map((button) => (
          <Route path={`/${button.page}`} element={<button.component />} />
        ))}
      </Routes>
    </>
  );
};

export default PolePage;
