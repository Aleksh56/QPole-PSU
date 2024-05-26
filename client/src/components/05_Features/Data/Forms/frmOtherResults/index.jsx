import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { v4 } from 'uuid';

import { nameReducer } from '@/utils/js/nameReducer';

const FrmOtherResults = ({ open, onClose, data, answers }) => {
  const filteredData = data.answer_options.filter((option) => option.is_free_response);

  const filteredAnswers = answers.answers
    .map((userAnswer) => {
      const answer = userAnswer.answers.find((item) => item.answers.question === data.id);
      return answer
        ? {
            profile: userAnswer.profile,
            text:
              answer.answers.answer_option !== null
                ? answer.answers.answer_option
                : answer.answers.text,
          }
        : null;
    })
    .filter(Boolean);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="sm"
      fullWidth
      sx={{ maxHeight: '500px' }}
    >
      <DialogTitle>Результаты</DialogTitle>
      <DialogContent dividers>
        {filteredAnswers.length > 0 ? (
          filteredAnswers.map((item, index) => (
            <Box
              key={v4()}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '8px 0',
                borderBottom: index < data.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Typography variant="body1" component="p">
                {nameReducer(
                  `${item.profile.surname} ${item.profile.name} ${item.profile.patronymic}`,
                )}
              </Typography>
              <Typography variant="body2" component="p">
                {item.text}
              </Typography>
            </Box>
          ))
        ) : (
          <p>Ответов &apos;Другое&apos; не найдено</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FrmOtherResults;
