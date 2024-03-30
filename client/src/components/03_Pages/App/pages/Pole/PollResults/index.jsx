import React, { useEffect, useState } from 'react';
import { ResultsGridWrapper, Wrapper } from './styled';
import PollResultCard from '@/components/05_Features/PollResultCard';
import { getPollResultsFx } from './model/get-results';
import { useParams } from 'react-router';

const PollResultsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPollResultsFx({ id });
      setQuestions(data.questions);
    };
    fetchResults();
  }, []);

  return (
    <Wrapper>
      <ResultsGridWrapper>
        {questions.map((item) => (
          <PollResultCard data={item} />
        ))}
      </ResultsGridWrapper>
    </Wrapper>
  );
};

export default PollResultsPage;
