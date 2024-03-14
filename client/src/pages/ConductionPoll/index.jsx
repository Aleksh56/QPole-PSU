import Header from '@/widgets/common/Header';
import React, { useEffect, useState } from 'react';
import { fetchPollQuestions } from './model/fetch-questions';
import { useNavigate, useParams } from 'react-router-dom';
import ConductionHeader from '@/widgets/ConductionPoll/ConductionHeader';
import QuestionBlock from '@/widgets/ConductionPoll/QuestionBlock';
import { ConductionWrapper } from './styled';
import { useUnit } from 'effector-react';
import { $answersStore, resetAnswers } from './store/answer-store';
import { sendAnswersRequestFx } from './model/send-answers';
import useAuth from '@/hooks/useAuth';

const ConductionPollPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const answers = useUnit($answersStore);
  const [pollData, setPollData] = useState({});

  useEffect(() => {
    const pollDataRequest = async () => {
      resetAnswers();
      const data = await fetchPollQuestions(id);
      if (data.has_user_participated_in || isAuthenticated === false) {
        navigate('/polls');
        return;
      }
      setPollData(data);
    };
    pollDataRequest();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      poll_id: id,
      answers: answers,
    };

    const response = await sendAnswersRequestFx(payload);
    if (!Object.keys(response.result).length > 0) {
      navigate('/polls');
    }
  };

  return (
    <>
      <Header isMainPage={false} />
      <ConductionWrapper>
        <ConductionHeader title={pollData.name} />
        {pollData?.questions?.map((item) => (
          <QuestionBlock question={item} />
        ))}
        <button onClick={() => handleSubmit()}>Send</button>
      </ConductionWrapper>
    </>
  );
};

export default ConductionPollPage;
