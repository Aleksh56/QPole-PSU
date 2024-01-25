import React from 'react';
import { TextField, Typography } from '@mui/material';

const PasswordResetNewPassFields = ({
  setResetAccountNewPassword,
  resetAccountNewPassword,
}) => {
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Новый пароль
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="new-password"
        placeholder="Пароль"
        name="new-password"
        autoComplete="new-password"
        autoFocus
        value={resetAccountNewPassword}
        onChange={(e) => setResetAccountNewPassword(e.target.value)}
      />
    </>
  );
};

export default PasswordResetNewPassFields;
