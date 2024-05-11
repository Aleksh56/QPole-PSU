import { Route, Routes } from 'react-router-dom';
import { v4 } from 'uuid';

import { poleNavigationButtonsData } from './data/PoleNavigationButtonsData';

import PollSettingsMenuNavigation from '@/components/04_Widgets/Navigation/Menus/PollSettingsMenuNavigation';

const PolePage = () => {
  return (
    <>
      <PollSettingsMenuNavigation buttons={poleNavigationButtonsData} />
      <Routes>
        {poleNavigationButtonsData.map((button) => (
          <Route key={v4()} path={`/${button.page}`} element={<button.component />} />
        ))}
      </Routes>
    </>
  );
};

export default PolePage;
