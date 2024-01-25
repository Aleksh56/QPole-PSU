import { TextField, Typography } from '@mui/material';
import React from 'react';

const PasswordResetEmailField = ({
  onResetAccountEmailChange,
  resetAccountEmailChangeState,
}) => {
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Введите вашу почту
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        placeholder="example@mail.ru"
        name="email"
        autoComplete="email"
        autoFocus
        value={resetAccountEmailChangeState}
        onChange={(e) => onResetAccountEmailChange(e.target.value)}
      />
    </>
  );
};

export default PasswordResetEmailField;
