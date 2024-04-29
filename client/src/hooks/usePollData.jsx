import { handleRequest } from '@/api/api';
import { useState, useEffect } from 'react';

const usePollData = (pollId) => {
  const [pollType, setPollType] = useState(null);
  const [pollStatus, setPollStatus] = useState(false);
  const [isMultiple, setIsMultiple] = useState(null);

  useEffect(() => {
    const fetchPollType = async () => {
      const data = await handleRequest('get', `/api/my_poll/?poll_id=${pollId}`);
      setPollStatus(data.data.is_in_production);
      setPollType(data.data.poll_type.name);
      setIsMultiple(data.data.has_multiple_choices);
    };

    fetchPollType();
  }, [pollId]);
  return { pollType, pollStatus, isMultiple };
};

export default usePollData;
