import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Button } from '@mui/material';
import CopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { designTokens } from '@/constants/designTokens';

const PoleQuestionsList = ({ questions, onSelectQuestion, onAddQuestion, selectedQuestion }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Button
        onClick={onAddQuestion}
        variant="outlined"
        style={{
          marginBottom: '10px',
          width: '100%',
          padding: '10px',
          borderColor: designTokens.colors.primaryBlue,
          color: designTokens.colors.primaryBlue,
        }}
      >
        Добавить вопрос
      </Button>
      <Box>
        {questions.map((question, index) => (
          <Card
            key={index}
            sx={{
              marginBottom: 2,
              boxShadow: selectedQuestion?.id === question.id ? 'none' : 3,
              border: selectedQuestion?.id === question.id ? '1px solid blue' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => onSelectQuestion(question)}
          >
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography variant="subtitle1" component="div">
                  Вопрос #{index + 1}
                </Typography>
                <Typography variant="body2" component="div">
                  {question.title || 'Любой текст, если заголовка нет'}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyQuestion(question);
                  }}
                >
                  <CopyIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuestion(question.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(PoleQuestionsList);
