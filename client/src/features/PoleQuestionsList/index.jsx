import React from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import CopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledAddButton, StyledCard, StyledCardContent, StyledContentWrapper } from './styled';
import { deleteQuestionRequest } from './api/apiRequests';
import { useParams } from 'react-router-dom';
import { copyQuestionFx } from './model/copy-question';

const PoleQuestionsList = ({
  questions,
  onSelectQuestion,
  onAddQuestion,
  selectedQuestion,
  setQuestions,
}) => {
  const { id } = useParams();

  const handleCopyQuestion = async (e, q_id) => {
    e.stopPropagation();
    const requestData = {
      request_type: 'copy_question',
      poll_id: id,
      question_id: q_id,
    };
    const newQue = await copyQuestionFx(requestData);
    setQuestions((prev) => [...prev, newQue]);
  };

  const handleDeleteQuestion = async (e, q_id) => {
    e.stopPropagation();
    await deleteQuestionRequest(id, q_id).then(() => {
      if (q_id === selectedQuestion?.id) {
        onSelectQuestion('');
      }
      const newQuestions = questions.filter((que) => que.id !== q_id);
      setQuestions(newQuestions);
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledAddButton onClick={onAddQuestion} variant="outlined">
        Добавить вопрос
      </StyledAddButton>
      <Box>
        {questions.map((question, index) => (
          <StyledCard
            key={question.id}
            selected={selectedQuestion?.id === question.id}
            onClick={() => onSelectQuestion(question.id)}
          >
            <StyledCardContent>
              <StyledContentWrapper>
                <Typography variant="subtitle1" component="div">
                  Вопрос #{index + 1}
                </Typography>
                <Typography variant="body2" component="div">
                  {question.title || ''}
                </Typography>
              </StyledContentWrapper>
              <Box>
                <IconButton aria-label="copy" onClick={(e) => handleCopyQuestion(e, question.id)}>
                  <CopyIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => handleDeleteQuestion(e, question.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </StyledCardContent>
          </StyledCard>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(PoleQuestionsList);
