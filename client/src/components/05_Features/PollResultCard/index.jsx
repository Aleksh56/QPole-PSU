import React from 'react';
import { CardAnswersCount, CardHeading, CardInfoWrapper, CardWrapper } from './styled';
import { PieChart, BarChart, LineChart } from '@mui/x-charts';

const PollResultCard = ({ data, chartType }) => {
  const chartData = data.answer_options.map((option) => ({
    id: option.id,
    value: option.votes_quantity,
    label: option.name,
  }));

  const renderChart = () => {
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
        <CardHeading>{data.name}:</CardHeading>
        <CardAnswersCount>Ответов: {data.votes_quantity}</CardAnswersCount>
      </CardInfoWrapper>
      {renderChart()}
    </CardWrapper>
  );
};

export default PollResultCard;
