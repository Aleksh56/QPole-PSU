import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';
import React, { useEffect, useState } from 'react';
import { fetchPollQuestions } from './model/fetch-questions';
import { useNavigate, useParams } from 'react-router-dom';
import ConductionHeader from '@/components/04_Widgets/Content/Display/conductionHeader';
import QueBlock from '@/components/04_Widgets/Content/Interactive/queBlock';
import { ConductionBackgroundWrapper, ConductionWrapper } from './styled';
import { useUnit } from 'effector-react';
import { $answersStore, resetAnswers } from './store/answer-store';
import { sendAnswersRequestFx } from './model/send-answers';
import useAuth from '@/hooks/useAuth';
import { shuffleArray } from '@/utils/js/shuffleArray';
import PollResult from '../PollResult';

const ConductionPollPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const answers = useUnit($answersStore);
  const [pollData, setPollData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    const pollDataRequest = async () => {
      resetAnswers();
      const data = await fetchPollQuestions(id);
      if ((!data.is_revote_allowed && data.has_user_participated_in) || isAuthenticated === false) {
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
    const response = await sendAnswersRequestFx({ answers, id });
    setResults(response.data);
    if (!response.data.poll_type === 'Викторина') {
      navigate('/polls');
    } else {
      setShowResults(true);
    }
  };

  const handleContextMenu = (e) => e.preventDefault();

  return (
    <ConductionBackgroundWrapper onContextMenu={handleContextMenu}>
      <Header isMainPage={false} />
      <ConductionWrapper>
        {showResults ? (
          <PollResult data={results} />
        ) : (
          <>
            <ConductionHeader data={pollData} />
            {pollData?.questions?.map((item) => (
              <QueBlock question={item} isMixed={pollData?.mix_options} />
            ))}
            <button onClick={() => handleSubmit()}>Send</button>
          </>
        )}
      </ConductionWrapper>
    </ConductionBackgroundWrapper>
  );
};

export default ConductionPollPage;
