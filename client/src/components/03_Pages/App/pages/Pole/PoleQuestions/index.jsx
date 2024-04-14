import React, { useState, useCallback, useEffect } from 'react';
import PoleCreateFirstQuestion from '@/components/05_Features/PollCreateFirstQuestion';
import { Box } from '@mui/material';
import PollQuestionsList from '@/components/05_Features/PollQuestionsList';
import PollQuestionEditForm from '@/components/05_Features/PollQuestionEditForm';
import {
  handleCreateQuestionRequest,
  handleGetAllQuestionRequest,
  handleGetQuestionInfoRequest,
} from './api/apiRequests';
import { useParams } from 'react-router-dom';
import { ListWrapper } from './styled';

const _settings = {
  title: 'Вы не создали ни одного вопроса',
  buttonCaption: 'Создать вопрос',
};

const PoleQuestionsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState({});

  useEffect(() => {
    handleGetAllQuestionRequest(id).then((res) => setQuestions(res.data));
  }, [id]);

  const handleCreateQuestion = useCallback(async () => {
    await handleCreateQuestionRequest(id).then(() =>
      handleGetAllQuestionRequest(id).then((res) => setQuestions(res.data))
    );
  }, [id]);

  const handleSelectQuestion = useCallback(
    async (question_id) => {
      await handleGetQuestionInfoRequest(id, question_id).then((res) =>
        setSelectedQuestion(res.data)
      );
    },
    [id]
  );

  return (
    <div>
      {questions.length === 0 ? (
        <PoleCreateFirstQuestion settings={_settings} handleCreateQuestion={handleCreateQuestion} />
      ) : (
        <ListWrapper>
          <Box sx={{ width: '25%' }}>
            <PollQuestionsList
              questions={questions}
              onSelectQuestion={handleSelectQuestion}
              onAddQuestion={handleCreateQuestion}
              selectedQuestion={selectedQuestion}
              setQuestions={setQuestions}
            />
          </Box>
          <Box sx={{ width: '75%' }}>
            {Object.keys(selectedQuestion).length > 0 && (
              <PollQuestionEditForm
                question={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
              />
            )}
          </Box>
        </ListWrapper>
      )}
    </div>
  );
};

export default PoleQuestionsPage;
