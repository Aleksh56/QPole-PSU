import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { v4 } from 'uuid';

import { nameReducer } from '@/utils/js/nameReducer';

const FrmOtherResults = ({ open, onClose, data }) => {
  const filteredData = data.answer_options.filter((option) => option.is_free_response);
  return (
    <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="sm" fullWidth>
      <DialogTitle>Результаты</DialogTitle>
      <DialogContent dividers>
        {filteredData?.length > 0 && filteredData[0].free_answers.length > 0 ? (
          filteredData[0].free_answers?.map((item, index) => (
            <Box
              key={v4()}
              sx={{
                display: 'grid',
                gridTemplateColumns: '0.35fr 1fr',
                padding: '8px 0',
                borderBottom: index < data.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Typography variant="body1" component="p">
                {nameReducer(item.name)}
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
