import React from 'react';
import { CardAnswersCount, CardHeading, CardInfoWrapper, CardWrapper } from './styled';
import { PieChart } from '@mui/x-charts';

const PollResultCard = ({ data }) => {
  const pieChartData = data.answer_options.map((option) => ({
    id: option.id,
    value: option.votes_quantity,
    label: option.name,
  }));

  return (
    <CardWrapper>
      <CardInfoWrapper>
        <CardHeading>{data.name}:</CardHeading>
        <CardAnswersCount>Ответов: {data.votes_quantity}</CardAnswersCount>
      </CardInfoWrapper>
      <PieChart
        series={[
          {
            data: pieChartData,
          },
        ]}
        width={450}
        height={200}
      />
    </CardWrapper>
  );
};

export default PollResultCard;
