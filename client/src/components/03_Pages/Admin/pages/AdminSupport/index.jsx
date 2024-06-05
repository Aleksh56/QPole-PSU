import { useEffect, useState } from 'react';

import { getTicketsFx } from '@/api/models/Tickets/get-tickets';
import CustomTable from '@/components/04_Widgets/Data/Vizualization/table';
import { admSupportTableCols } from '@/data/fields';

const AdmSupportPage = () => {
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await getTicketsFx();
      setTicketData(res.results);
    };
    fetchTickets();
  }, []);

  return <CustomTable columns={admSupportTableCols} data={ticketData} />;
};

export default AdmSupportPage;
