import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PoleCreateFirstQuestion from '@/features/PoleCreateFirstQuestion';
import { Box } from '@mui/material';
import PoleQuestionsList from '@/features/PoleQuestionsList';
import PoleQuestionEditForm from '@/features/PoleQuestionEditForm';
import {
  handleCreateQuestionRequest,
  handleGetAllQuestionRequest,
  handleGetQuestionInfoRequest,
} from './api/apiRequests';
import { useParams } from 'react-router-dom';

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
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px 0',
            columnGap: '30px',
          }}
        >
          <Box sx={{ width: '25%' }}>
            <PoleQuestionsList
              questions={questions}
              onSelectQuestion={handleSelectQuestion}
              onAddQuestion={handleCreateQuestion}
              selectedQuestion={selectedQuestion}
              setQuestions={setQuestions}
            />
          </Box>
          <Box sx={{ width: '75%' }}>
            {selectedQuestion && <PoleQuestionEditForm question={selectedQuestion} />}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default PoleQuestionsPage;
