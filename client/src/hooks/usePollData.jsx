import { useEffect, useState } from 'react';

import { handleRequest } from '@/api/api';

const usePollData = (pollId) => {
  const [pollType, setPollType] = useState(null);
  const [pollStatus, setPollStatus] = useState(false);
  const [isMultiple, setIsMultiple] = useState(null);

  useEffect(() => {
    const fetchPollType = async () => {
      const data = await handleRequest('get', `/api/my_poll/?poll_id=${pollId}&detailed=0`);
      setPollStatus(data.data.is_in_production);
      setPollType(data.data.poll_type.name);
      setIsMultiple(data.data.has_multiple_choices);
    };

    fetchPollType();
  }, [pollId]);
  return { pollType, pollStatus, isMultiple };
};

export default usePollData;
