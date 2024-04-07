import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';
import PollFilters from '@/components/04_Widgets/PollList/PollFilters';
import React, { useEffect, useState } from 'react';
import { ContentWrapper, PollListPageContentWrapper } from './styled';
import PollListOutput from '@/components/04_Widgets/PollList/PollListOutput';
import { fetchAllPollsFx } from './model/fetch-polls';
import { CircularProgress } from '@mui/material';
import CustomPagination from '@/components/07_Shared/UIComponents/Navigation/pagination';
import usePagination from '@/hooks/usePagination';

const PollListPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pageSize, currPage, totalPages, setTotalPages, handlePageSizeChange, handlePageChange } =
    usePagination();

  const fetchAllPollsRequest = async () => {
    setLoading(true);
    const data = await fetchAllPollsFx({ currPage, pageSize });
    setPolls(data.results);
    setTotalPages(data.total_pages);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPollsRequest();
  }, [currPage, pageSize]);

  return (
    <>
      <Header isMainPage={false} />
      <PollListPageContentWrapper>
        <PollFilters />
        {!loading && (
          <ContentWrapper>
            <PollListOutput polls={polls} />
            <CustomPagination
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currPage}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          </ContentWrapper>
        )}
        {loading && <CircularProgress />}
      </PollListPageContentWrapper>
    </>
  );
};

export default PollListPage;
