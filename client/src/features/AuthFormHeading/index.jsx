import React from 'react';
import { Typography, Box } from '@mui/material';
import { FormHeadingContainer } from './styled';

const AuthFormHeading = ({ isSignIn, handleFormSwitch }) => {
  return (
    <FormHeadingContainer>
      <Typography variant="h5" gutterBottom>
        {isSignIn ? 'Вход' : 'Регистрация'}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Box>
          <span>{isSignIn ? 'Нет аккаунта ?' : 'Уже есть аккаунт?'}</span>
          <button onClick={handleFormSwitch}>
            {isSignIn ? 'Регистрация' : 'Войти'}
          </button>
        </Box>
      </Typography>
    </FormHeadingContainer>
  );
};

export default AuthFormHeading;
