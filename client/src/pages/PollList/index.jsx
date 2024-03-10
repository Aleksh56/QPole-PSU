import Header from '@/widgets/Header';
import PollFilters from '@/widgets/PollList/PollFilters';
import React, { useEffect, useState } from 'react';
import { PollListPageContentWrapper } from './styled';
import PollListOutput from '@/widgets/PollList/PollListOutput';
import { fetchAllPolls } from './model/fetch-polls';
import { CircularProgress } from '@mui/material';

const PollListPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllPollsRequest = async () => {
      setLoading(true);
      const data = await fetchAllPolls();
      setPolls(data);
      setLoading(false);
    };
    fetchAllPollsRequest();
  }, []);
  return (
    <>
      <Header isMainPage={false} />
      <PollListPageContentWrapper>
        <PollFilters />
        {!loading && <PollListOutput polls={polls} />}
        {loading && <CircularProgress />}
      </PollListPageContentWrapper>
    </>
  );
};

export default PollListPage;
