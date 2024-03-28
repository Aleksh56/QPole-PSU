import Header from '@/components/04_Widgets/common/Header';
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
import { shuffleArray } from '@/utils/js/shuffleArray';

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
      if (data.mix_questions) {
        data.questions = shuffleArray(data.questions);
      }
      setPollData(data);
    };
    pollDataRequest();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      answers: answers,
    };

    const response = await sendAnswersRequestFx({ answers, id });
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
          <QuestionBlock question={item} isMixed={pollData?.mix_options} />
        ))}
        <button onClick={() => handleSubmit()}>Send</button>
      </ConductionWrapper>
    </>
  );
};

export default ConductionPollPage;
