import React from 'react';
import { CardAnswersCount, CardHeading, CardInfoWrapper, CardWrapper } from './styled';
import { PieChart } from '@mui/x-charts';

const PollResultCard = ({ data }) => {
  const pieChartData = data.answer_options.map((option) => ({
    id: option.id,
    value: option.answers.length,
    label: option.name,
  }));
  const totalAnswersCount = data.answer_options.reduce(
    (acc, option) => acc + option.answers.length,
    0
  );
  return (
    <CardWrapper>
      <CardInfoWrapper>
        <CardHeading>{data.name}:</CardHeading>
        <CardAnswersCount>Ответов: {totalAnswersCount}</CardAnswersCount>
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
