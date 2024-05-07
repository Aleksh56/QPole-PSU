import { Route, Routes } from 'react-router-dom';

import { poleNavigationButtonsData } from './data/PoleNavigationButtonsData';

import PollSettingsMenuNavigation from '@/components/05_Features/PollSettingsMenuNavigation';

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
