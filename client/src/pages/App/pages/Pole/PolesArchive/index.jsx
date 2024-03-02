import { getAllPoles, getProfileData } from '@/pages/App/api/apiRequests';
import AppHeader from '@/widgets/AppHeader';
import AppPolesFilters from '@/widgets/AppPolesFilters';
import React, { useEffect, useState } from 'react';
import { ContentWrapper, PollsGrid, StyledAppContentWrapper } from './styled';
import { CircularProgress } from '@mui/material';
import AppPoleCard from '@/shared/AppPoleCard';
import CreatePoleModal from '@/widgets/CreatePoleModal';
import { _settings } from '@/pages/App/config/settings';
import { Link } from 'react-router-dom';

const PolesArchivePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [pollData, setPollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  const fetchData = async () => {
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
      <AppPolesFilters handleCreateModalOpen={setIsCreateModalOpen} setPollData={setPollData} />
      {loading ? (
        <StyledAppContentWrapper>
          <CircularProgress />
        </StyledAppContentWrapper>
      ) : (
        <StyledAppContentWrapper>
          <ContentWrapper>
            <PollsGrid>
              {pollData
                .filter((item) => item.is_closed)
                .map((item) => (
                  <Link key={item.poll_id} to={`/app/tests/${item.poll_id}/main`}>
                    <AppPoleCard pollData={item} fetchData={fetchData} />
                  </Link>
                ))}
            </PollsGrid>
          </ContentWrapper>
        </StyledAppContentWrapper>
      )}
      <CreatePoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={_settings.survey.popUpTitle}
        buttons={_settings.survey.surveyButtons}
      />
    </>
  );
};

export default PolesArchivePage;
