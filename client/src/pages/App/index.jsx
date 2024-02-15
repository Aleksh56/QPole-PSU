import React, { useEffect, useState } from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';
import CreatePoleModal from '@/widgets/CreatePoleModal';
import { surveyTypesData } from './data/SurveyTypesData';
import AppPoleCard from '@/shared/AppPoleCard';
import { getAllPoles } from './api/apiRequests';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AppPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [pollData, setPollData] = useState([]);
  const _settings = {
    title: 'Вы не создали ни одного теста или опроса',
    description: 'Вы можете сразу приступить к созданию своего первого теста',
    buttonCaption: 'Создать новый опрос',
    survey: {
      popUpTitle: 'Выберите тип создаваемого опроса',
      surveyButtons: [...surveyTypesData],
    },
  };

  useEffect(() => {
    const fetchPoles = async () => {
      setLoading(true);
      const requestPollData = await getAllPoles();
      setPollData(requestPollData.data);
      setLoading(false);
    };
    fetchPoles();
  }, []);

  return (
    <>
      <AppHeader />
      <AppPolesFilters handleCreateModalOpen={setIsCreateModalOpen} />
      {!pollData && (
        <AppCreateFirstPole settings={_settings} handleOpenCreatePoleModal={setIsCreateModalOpen} />
      )}
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
        }}
      >
        {pollData.length > 0 &&
          pollData.map((item) => {
            return (
              <Link to={`/app/tests/${item.poll_id}/main`}>
                <AppPoleCard imageUrl="" pollData={item} />
              </Link>
            );
          })}
      </Box>
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
