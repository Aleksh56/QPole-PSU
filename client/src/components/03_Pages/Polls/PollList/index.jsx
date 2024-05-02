import { useEffect, useState } from 'react';

import { fetchAllPollsFx } from './model/fetch-polls';
import { ContentWrapper, PollListPageContentWrapper } from './styled';

import PollFilters from '@/components/04_Widgets/Content/Interactive/pollFilters';
import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';
import PollListOut from '@/components/05_Features/DataDisplay/Out/pollListOut';
import CustomPagination from '@/components/07_Shared/UIComponents/Navigation/pagination';
import CLoader from '@/components/07_Shared/UIComponents/Utils/Helpers/loader';
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
        <PollFilters setPolls={setPolls} />
        {!loading && (
          <ContentWrapper>
            <PollListOut polls={polls} />
            <CustomPagination
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currPage}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          </ContentWrapper>
        )}
        {loading && <CLoader />}
      </PollListPageContentWrapper>
    </>
  );
};

export default PollListPage;
