import React, { useState, useCallback, useMemo } from 'react';
import PoleCreateFirstQuestion from '@/features/PoleCreateFirstQuestion';
import { Box } from '@mui/material';
import PoleQuestionsList from '@/features/PoleQuestionsList';
import PoleQuestionEditForm from '@/features/PoleQuestionEditForm';

const PoleQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const _settings = {
    title: 'Вы не создали ни одного вопроса',
    buttonCaption: 'Создать вопрос',
  };

  const handleCreateQuestion = useCallback(() => {
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Новый вопрос',
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  }, []);

  const handleSelectQuestion = useCallback((question) => {
    setSelectedQuestion(question);
  }, []);

  const questionsContent = useMemo(() => {
    if (questions.length === 0) {
      return (
        <PoleCreateFirstQuestion settings={_settings} handleCreateQuestion={handleCreateQuestion} />
      );
    } else {
      return (
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
            />
          </Box>
          <Box sx={{ width: '75%' }}>
            {selectedQuestion && <PoleQuestionEditForm question={selectedQuestion} />}
          </Box>
        </Box>
      );
    }
  }, [questions, selectedQuestion, handleCreateQuestion, handleSelectQuestion]);

  return <div>{questionsContent}</div>;
};

export default PoleQuestionsPage;
