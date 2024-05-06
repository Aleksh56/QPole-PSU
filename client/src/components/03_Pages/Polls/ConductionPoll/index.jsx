import { useUnit } from 'effector-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PollResult from '../PollResult';

import { fetchPollQuestions } from './model/fetch-questions';
import { sendAnswersRequestFx } from './model/send-answers';
import { $answersStore, resetAnswers } from './store/answer-store';
import { ConductionBackgroundWrapper, ConductionWrapper } from './styled';

import { useAlert } from '@/app/context/AlertProvider';
import ConductionHeader from '@/components/04_Widgets/Content/Display/conductionHeader';
import QueBlock from '@/components/04_Widgets/Content/Interactive/queBlock';
import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';
import Timer from '@/components/07_Shared/UIComponents/Utils/Helpers/timer';
import useAuth from '@/hooks/useAuth';
import { shuffleArray } from '@/utils/js/shuffleArray';

const ConductionPollPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const answers = useUnit($answersStore);
  const [pollData, setPollData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [isTextLong, setIsTextLong] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    const pollDataRequest = async () => {
      resetAnswers();
      const data = await fetchPollQuestions(id);
      if ((!data.is_revote_allowed && data.has_user_participated_in) || isAuthenticated === false) {
        navigate('/polls');
        return;
      }
      if (data.mix_questions) data.questions = shuffleArray(data.questions);
      setIsCollapsed(data.poll_setts?.completion_time !== null);
      setPollData(data);
    };
    pollDataRequest();
  }, [isLoading, isAuthenticated, id]);

  useEffect(() => {
    const requiredQuestions = pollData.questions
      ?.filter((q) => q.is_required)
      .map((item) => item.id);
    const answersSelected = answers.map((item) => item.question);

    const areAllRequiredAnswered = requiredQuestions?.every((item) =>
      answersSelected.includes(item),
    );
    setIsSubmitEnabled(areAllRequiredAnswered);
  }, [pollData.questions, answers]);

  const handleSubmit = async () => {
    const response = await sendAnswersRequestFx({ answers, id });
    setResults(response.data);
    if (response.data.poll_type !== 'Викторина') {
      showAlert('Ваш голос успешно записан!', 'success');
      setTimeout(() => {
        navigate('/polls');
      }, 1500);
    } else {
      setShowResults(true);
    }
  };

  const handleContextMenu = (e) => e.preventDefault();

  const handleStart = () => setIsCollapsed(false);

  return (
    <ConductionBackgroundWrapper onContextMenu={handleContextMenu}>
      <Header isMainPage={false} />
      <ConductionWrapper>
        {showResults ? (
          <PollResult data={results} />
        ) : (
          <>
            <ConductionHeader data={pollData} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '18px',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Timer initialTime="00:05:00" />
                  {pollData?.questions?.map((item) => (
                    <QueBlock
                      key={item.id}
                      question={item}
                      isMixed={pollData?.mix_options}
                      setIsLong={setIsTextLong}
                    />
                  ))}
                  <PrimaryButton
                    caption="Отправить"
                    handleClick={() => handleSubmit()}
                    disabled={!isSubmitEnabled || isTextLong}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </ConductionWrapper>
      {isCollapsed && <PrimaryButton caption="Начать" handleClick={handleStart} />}
    </ConductionBackgroundWrapper>
  );
};

export default ConductionPollPage;
