import { TextField, Typography } from '@mui/material';
import React from 'react';

const PasswordResetCodeField = ({
  onResetAccountCodeChange,
  resetAccountCode,
}) => {
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Введите код восстановления
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="code"
        placeholder="000-000"
        name="code"
        autoComplete="one-time-code"
        autoFocus
        value={resetAccountCode}
        onChange={(e) => onResetAccountCodeChange(e.target.value)}
      />
    </>
  );
};

export default PasswordResetCodeField;
