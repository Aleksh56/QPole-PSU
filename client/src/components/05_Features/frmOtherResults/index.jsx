import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Box } from '@mui/material';

const FrmOtherResults = ({ open, onClose, data }) => {
  const filteredData = data.answer_options.filter((option) => option.is_free_response);

  return (
    <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="sm" fullWidth>
      <DialogTitle>Результаты</DialogTitle>
      <DialogContent dividers>
        {filteredData?.length > 0 && filteredData[0].free_answers.length > 0 ? (
          filteredData[0].free_answers?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: index < data.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Typography variant="body1" component="span">
                {item.name}
              </Typography>
              <Typography variant="body2" component="span">
                {item.text}
                {/* Fix for long text */}
              </Typography>
            </Box>
          ))
        ) : (
          <p>Ответов "Другое" не найдено</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FrmOtherResults;
