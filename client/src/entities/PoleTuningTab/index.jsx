import React from 'react';
import { Stack, TextField } from '@mui/material';

const PoleTuningTab = () => {
  return (
    <Stack spacing={2}>
      <TextField fullWidth label="Название теста" variant="outlined" />
      <TextField
        fullWidth
        label="Описание теста"
        variant="outlined"
        multiline
        rows={4}
      />
    </Stack>
  );
};

export default PoleTuningTab;
