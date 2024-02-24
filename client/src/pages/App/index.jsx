import React, { useEffect, useState } from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';
import CreatePoleModal from '@/widgets/CreatePoleModal';
import AppPoleCard from '@/shared/AppPoleCard';
import { getAllPoles, getProfileData } from './api/apiRequests';
import { Link } from 'react-router-dom';
import { StyledAppContentWrapper } from './styled';
import { _settings } from './config/settings';
import { CircularProgress } from '@mui/material';

const AppPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [pollData, setPollData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const [pollResponse, userResponse] = await Promise.all([getAllPoles(), getProfileData()]);
    setPollData(pollResponse.data);
    setUserData(userResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AppHeader userData={userData} />
      <AppPolesFilters handleCreateModalOpen={setIsCreateModalOpen} />

      {!loading && pollData.length === 0 ? (
        <AppCreateFirstPole settings={_settings} handleOpenCreatePoleModal={setIsCreateModalOpen} />
      ) : (
        ''
      )}
      <StyledAppContentWrapper>
        {!loading && pollData.length > 0 ? (
          pollData.map((item) => {
            return (
              <Link to={`/app/tests/${item.poll_id}/main`}>
                <AppPoleCard pollData={item} fetchData={fetchData} />
              </Link>
            );
          })
        ) : (
          <CircularProgress />
        )}
      </StyledAppContentWrapper>
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
