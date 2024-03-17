import { handleRequest } from '@/api/api';
import { useState, useEffect } from 'react';

const usePollType = (pollId) => {
  const [pollType, setPollType] = useState(null);
  const [isMultiple, setIsMultiple] = useState(null);

  useEffect(() => {
    const fetchPollType = async () => {
      const data = await handleRequest('get', `/api/my_poll/?poll_id=${pollId}`);
      setPollType(data.data.poll_type.name);
      setIsMultiple(data.data.has_multiple_choices);
    };

    fetchPollType();
  }, [pollId]);
  return { pollType, isMultiple };
};

export default usePollType;
