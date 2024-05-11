// import { useEffect, useState } from 'react';

// import { handleRequest } from '@/api/api';

// const usePollData = (pollId) => {
//   const [pollType, setPollType] = useState(null);
//   const [pollStatus, setPollStatus] = useState(false);
//   const [pollData, setPollData] = useState({});
//   const [isMultiple, setIsMultiple] = useState(null);

//   useEffect(() => {
//     const fetchPollType = async () => {
//       const { data } = await handleRequest('get', `/api/my_poll/?poll_id=${pollId}&detailed=0`);
//       setPollData(data);
//       setPollStatus(data.is_in_production);
//       setPollType(data.poll_type.name);
//       setIsMultiple(data.has_multiple_choices);
//     };

//     fetchPollType();
//   }, [pollId]);
//   return { pollType, pollStatus, isMultiple, pollData };
// };

// export default usePollData;

import { useUnit } from 'effector-react';
import { useCallback, useEffect } from 'react';

import {
  fetchPollDataFx,
  isMultipleStore,
  pollDataStore,
  pollStatusStore,
  pollTypeStore,
} from '@/api/store/poll-data';

const usePollData = (pollId) => {
  const pollData = useUnit(pollDataStore);
  const pollStatus = useUnit(pollStatusStore);
  const pollType = useUnit(pollTypeStore);
  const isMultiple = useUnit(isMultipleStore);

  const fetchDataCallback = useCallback(() => {
    fetchPollDataFx(pollId);
  }, [pollId]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  return { pollType, pollStatus, isMultiple, pollData };
};

export default usePollData;
