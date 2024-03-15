import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PollSettingsMenuNavigation from '@/components/05_Features/PollSettingsMenuNavigation';
import { poleNavigationButtonsData } from './data/PoleNavigationButtonsData';

const PolePage = () => {
  return (
    <>
      <PollSettingsMenuNavigation buttons={poleNavigationButtonsData} />
      <Routes>
        {poleNavigationButtonsData.map((button) => (
          <Route path={`/${button.page}`} element={<button.component />} />
        ))}
      </Routes>
    </>
  );
};

export default PolePage;
