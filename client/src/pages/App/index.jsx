import React from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';

const AppPage = () => {
  const _settings = {
    title: 'Вы не создали ни одного теста или опроса',
    description: 'Вы можете сразу приступить к созданию своего первого теста',
    buttonCaption: 'Создать новый опрос',
  };
  return (
    <>
      <AppHeader />
      <AppPolesFilters />
      <AppCreateFirstPole settings={_settings} />
    </>
  );
};

export default AppPage;
