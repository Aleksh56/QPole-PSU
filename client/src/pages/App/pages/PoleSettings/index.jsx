import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PoleSettingsMenuNavigation from '@/features/PoleSettingsMenuNavigation';
import { poleNavigationButtonsData } from './data/PoleNavigationButtonsData';

const PolePage = () => {
  return (
    <>
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
