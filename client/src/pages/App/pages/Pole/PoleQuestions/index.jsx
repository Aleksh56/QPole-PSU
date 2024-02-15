import React, { useState } from 'react';
import PoleCreateFirstQuestion from '@/features/PoleCreateFirstQuestion';

const PoleQuestionsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const _settings = {
    title: 'Вы не создали ни одного вопроса',
    buttonCaption: 'Создать вопрос',
  };

  const handleCreateQuestion = () => {};

  return (
    <div>
      <PoleCreateFirstQuestion settings={_settings} handleCreateQuestion={handleCreateQuestion} />
    </div>
  );
};

export default PoleQuestionsPage;
