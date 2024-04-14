import { getAllPoles } from '@/components/03_Pages/App/api/apiRequests';
import AppPollFilters from '@/components/04_Widgets/Content/Interactive/appPollFilter';
import React, { useEffect, useState } from 'react';
import { ContentWrapper, PollsGrid, StyledAppContentWrapper } from './styled';
import { CircularProgress } from '@mui/material';
import AppPoleCard from '@/components/07_Shared/DataDisplay/Cards/appPoleCard';
import FrmCreatePoll from '@/components/04_Widgets/Utilities/Modals/frmCreatePoll';
import { _settings } from '@/components/03_Pages/App/config/settings';
import { Link } from 'react-router-dom';

const PolesArchivePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [pollData, setPollData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <AppPollFilters handleCreateModalOpen={setIsCreateModalOpen} setPollData={setPollData} />
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
      <FrmCreatePoll
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={_settings.survey.popUpTitle}
        buttons={_settings.survey.surveyButtons}
      />
    </>
  );
};

export default PolesArchivePage;
