import React from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';
import useModalState from '@/hooks/useModalState';
import CreatePoleModal from '@/widgets/CreatePoleModal';

const AppPage = () => {
  const { isCreateModalOpen, toggleCreateModal } = useModalState();
  const _settings = {
    title: 'Вы не создали ни одного теста или опроса',
    description: 'Вы можете сразу приступить к созданию своего первого теста',
    buttonCaption: 'Создать новый опрос',
  };
  const yourData = {
    buttons: [
      {
        image: 'путь_к_изображению_1',
        title: 'Тест викторина',
        caption:
          'Есть правильные и неправильные ответы. Считается кол-во баллов',
      },
      {
        image: 'путь_к_изображению_2',
        title: 'Личностный тест',
        caption:
          'Нет правильных ответов. Результаты привязываются к вариантам ответов',
      },
      {
        image: 'путь_к_изображению_3',
        title: 'Квиз опросник',
        caption:
          'Возможность ветвления и начисление баллов за определенные ответы',
      },
    ],
  };
  return (
    <>
      <AppHeader />
      <AppPolesFilters handleCreateModalOpen={toggleCreateModal} />
      <AppCreateFirstPole settings={_settings} />
      <CreatePoleModal
        isOpen={isCreateModalOpen}
        onClose={toggleCreateModal}
        title={'Выберите тип создаваемого опроса'}
        buttons={yourData.buttons}
      />
    </>
  );
};

export default AppPage;
