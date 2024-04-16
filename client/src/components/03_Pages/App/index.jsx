import React, { useEffect, useState } from 'react';
import AppCreateFirstPoll from '@/components/05_Features/AppCreateFirstPoll';
import AppPollFilters from '@/components/04_Widgets/Content/Interactive/appPollFilter';
import FrmCreatePoll from '@/components/04_Widgets/Utilities/Modals/frmCreatePoll';
import AppPoleCard from '@/components/07_Shared/DataDisplay/Cards/appPoleCard';
import { getAllPoles } from './api/apiRequests';
import { Link } from 'react-router-dom';
import { ContentWrapper, PollsGrid, StyledAppContentWrapper, StyledArchiveLink } from './styled';
import { _settings } from './config/settings';
import { CircularProgress, Box } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import usePageTitle from '@/hooks/usePageTitle';
import CustomPagination from '@/components/07_Shared/UIComponents/Navigation/pagination';
import usePagination from '@/hooks/usePagination';

const AppPage = () => {
  usePageTitle('app');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [pollData, setPollData] = useState([]);
  const { pageSize, currPage, totalPages, setTotalPages, handlePageSizeChange, handlePageChange } =
    usePagination();

  const fetchData = async () => {
    const pollResponse = await getAllPoles({ currPage, pageSize });
    setPollData(pollResponse.results);
    setTotalPages(pollResponse.total_pages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currPage, pageSize]);

  return (
    <>
      <AppPollFilters handleCreateModalOpen={setIsCreateModalOpen} setPollData={setPollData} />
      {loading ? (
        <StyledAppContentWrapper>
          <CircularProgress />
        </StyledAppContentWrapper>
      ) : pollData && pollData.length === 0 ? (
        <AppCreateFirstPoll settings={_settings} handleOpenCreatePoleModal={setIsCreateModalOpen} />
      ) : (
        <StyledAppContentWrapper>
          <ContentWrapper>
            <StyledArchiveLink to={'/app/polls-archive'}>
              <InboxIcon />
              Архив
            </StyledArchiveLink>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '30px',
              }}
            >
              <PollsGrid>
                {pollData
                  .filter((item) => !item.is_closed)
                  .map((item) => (
                    <Link key={item.poll_id} to={`/app/tests/${item.poll_id}/main`}>
                      <AppPoleCard pollData={item} fetchData={fetchData} />
                    </Link>
                  ))}
              </PollsGrid>
              <CustomPagination
                pageSize={pageSize}
                totalPages={totalPages}
                currentPage={currPage}
                handlePageChange={handlePageChange}
                handlePageSizeChange={handlePageSizeChange}
              />
            </Box>
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

export default AppPage;
