import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { deleteQuestionRequest } from './api/apiRequests';
import { copyQuestionFx } from './model/copy-question';
import {
  IconsWrapper,
  ListWrapper,
  StyledAddButton,
  StyledCard,
  StyledCardContent,
  StyledContentWrapper,
  StyledQueCount,
} from './styled';

import usePollData from '@/hooks/usePollData';

const PollQuestionsList = ({
  questions,
  onSelectQuestion,
  onAddQuestion,
  selectedQuestion,
  setQuestions,
  setSelected,
}) => {
  const { id } = useParams();
  const { pollStatus } = usePollData(id);

  const handleCopyQuestion = useCallback(
    async (e, q_id) => {
      e.stopPropagation();
      if (pollStatus) return;
      const newQue = await copyQuestionFx({ id, q_id });
      setQuestions((prev) => [...prev, newQue]);
    },
    [id, setQuestions],
  );

  const handleDeleteQuestion = async (e, q_id) => {
    e.stopPropagation();
    if (pollStatus) return;
    await deleteQuestionRequest(id, q_id).then(() => {
      if (q_id === selectedQuestion?.id) {
        setSelected({});
      }
      const newQuestions = questions.filter((que) => que.id !== q_id);
      setQuestions(newQuestions);
    });
  };

  return (
    <ListWrapper>
      <StyledAddButton onClick={onAddQuestion} variant="outlined" disabled={pollStatus}>
        Добавить вопрос
      </StyledAddButton>
      <StyledQueCount>Количество вопросов - {questions.length}</StyledQueCount>
      <Box>
        {questions.map((question, index) => (
          <StyledCard
            key={question.id}
            selected={selectedQuestion?.id === question.id}
            onClick={() => onSelectQuestion(question.id)}
          >
            <StyledCardContent className="que-card">
              <StyledContentWrapper>
                <Typography variant="subtitle1" component="div">
                  №{index + 1}
                </Typography>
                <Typography variant="body2" component="div">
                  {question.name || 'Без заголовка'}
                </Typography>
              </StyledContentWrapper>
              <IconsWrapper>
                <ContentCopyIcon onClick={(e) => handleCopyQuestion(e, question.id)} />
                <DeleteOutlineIcon onClick={(e) => handleDeleteQuestion(e, question.id)} />
              </IconsWrapper>
            </StyledCardContent>
          </StyledCard>
        ))}
      </Box>
    </ListWrapper>
  );
};

export default React.memo(PollQuestionsList);
