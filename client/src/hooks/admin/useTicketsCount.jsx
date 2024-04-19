import { useState, useEffect } from 'react';
import { getTicketsFx } from '@/api/common-requests/tickets/get-tickets';

const useTicketsCount = () => {
  const [ticketsCount, setTicketsCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await getTicketsFx();
      setTicketsCount(res.total_items);
    };

    fetchTickets();
  }, []);

  return { ticketsCount };
};

export default useTicketsCount;
