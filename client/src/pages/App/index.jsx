import React, { useState } from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';
import CreatePoleModal from '@/widgets/CreatePoleModal';
import { surveyTypesData } from './data/SurveyTypesData';

const AppPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const _settings = {
    title: 'Вы не создали ни одного теста или опроса',
    description: 'Вы можете сразу приступить к созданию своего первого теста',
    buttonCaption: 'Создать новый опрос',
    survey: {
      popUpTitle: 'Выберите тип создаваемого опроса',
      surveyButtons: [...surveyTypesData],
    },
  };

  return (
    <>
      <AppHeader />
      <AppPolesFilters handleCreateModalOpen={setIsCreateModalOpen} />
      <AppCreateFirstPole
        settings={_settings}
        handleOpenCreatePoleModal={setIsCreateModalOpen}
      />
      <CreatePoleModal
        isOpen={isCreateModalOpen}
        onClose={setIsCreateModalOpen}
        title={_settings.survey.popUpTitle}
        buttons={_settings.survey.surveyButtons}
      />
    </>
  );
};

export default AppPage;
