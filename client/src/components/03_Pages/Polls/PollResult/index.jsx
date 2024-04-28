import PollResultHeader from '@/components/05_Features/Poll/PollResultHeader';
import ConductionResCrd from '@/components/05_Features/conductionResCrd';
import React from 'react';
import { v4 } from 'uuid';

const PollResult = ({ data }) => {
  const { questions, result, results } = data;

  return (
    <>
      <PollResultHeader res={results} data={data} />
      {questions.map((item) => (
        <ConductionResCrd key={v4()} question={item} answers={result.answers} />
      ))}
    </>
  );
};

export default PollResult;
