import React, { useEffect, useState } from 'react';
import AppCreateFirstPole from '@/features/AppCreateFirstPole';
import AppPolesFilters from '@/widgets/app/AppPolesFilters';
import CreatePoleModal from '@/widgets/CreatePoleModal';
import AppPoleCard from '@/shared/AppPoleCard';
import { getAllPoles } from './api/apiRequests';
import { Link } from 'react-router-dom';
import { ContentWrapper, PollsGrid, StyledAppContentWrapper, StyledArchiveLink } from './styled';
import { _settings } from './config/settings';
import { CircularProgress } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const AppPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [pollData, setPollData] = useState([]);

  const fetchData = async () => {
    const pollResponse = await getAllPoles();
    setPollData(pollResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AppPolesFilters handleCreateModalOpen={setIsCreateModalOpen} setPollData={setPollData} />
      {loading ? (
        <StyledAppContentWrapper>
          <CircularProgress />
        </StyledAppContentWrapper>
      ) : pollData && pollData.length === 0 ? (
        <AppCreateFirstPole settings={_settings} handleOpenCreatePoleModal={setIsCreateModalOpen} />
      ) : (
        <StyledAppContentWrapper>
          <ContentWrapper>
            <StyledArchiveLink to={'/app/polls-archive'}>
              <InboxIcon />
              Архив
            </StyledArchiveLink>
            <PollsGrid>
              {pollData &&
                pollData
                  .filter((item) => item.is_closed !== true)
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

export default AppPage;
