import { Box } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useState } from 'react';

import FrmOtherResults from '../frmOtherResults';

import { CardAnswersCount, CardHeading, CardInfoWrapper, CardWrapper, InfoButton } from './styled';

const PollResultCard = ({ data, chartType }) => {
  const [infoOpen, setInfoOpen] = useState(false);

  const renderChart = () => {
    const chartData = data.answer_options.map((option) => ({
      id: option.id,
      value: option.votes_quantity,
      label: option.is_free_response ? 'Другое' : option.name,
    }));

    switch (chartType) {
      case 'bar':
        return <BarChart series={[{ data: chartData }]} width={450} height={200} />;
      case 'line':
        return <LineChart series={[{ data: chartData }]} width={450} height={200} />;
      case 'pie':
      default:
        return <PieChart series={[{ data: chartData }]} width={450} height={200} />;
    }
  };

  return (
    <CardWrapper>
      <CardInfoWrapper>
        <Box>
          <CardHeading>{data.name ?? ''}:</CardHeading>
          <CardAnswersCount>Ответов: {data.votes_quantity}</CardAnswersCount>
        </Box>
        <InfoButton onClick={() => setInfoOpen(true)}>Подробнее</InfoButton>
      </CardInfoWrapper>
      {renderChart()}
      <FrmOtherResults open={infoOpen} onClose={() => setInfoOpen(false)} data={data} />
    </CardWrapper>
  );
};

export default PollResultCard;
