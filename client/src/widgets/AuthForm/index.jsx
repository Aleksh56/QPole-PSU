import React from 'react';
import {
  FormContainer,
  FormGridWrapper,
  StyledConfirmButton,
  StyledForm,
  StyledPasswordWrapper,
} from './styled';
import { Box, TextField, Typography } from '@mui/material';
import AuthFormHeading from '@/features/AuthFormHeading';
import AuthPhoneField from '@/features/AuthPhoneField';

const AuthForm = ({
  isSignIn,
  handleFormSwitch = () => {},
  handleFormSubmit = () => {},
}) => {
  return (
    <FormGridWrapper item>
      <FormContainer>
        <AuthFormHeading
          isSignIn={isSignIn}
          handleFormSwitch={handleFormSwitch}
        />
        <StyledForm onSubmit={handleFormSubmit}>
          <Typography variant="subtitle1" gutterBottom>
            Ваша почта
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Эл. почта"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <StyledPasswordWrapper>
            <Typography variant="subtitle1" gutterBottom>
              Пароль
            </Typography>
            {isSignIn ? <button>Забыли пароль?</button> : ''}
          </StyledPasswordWrapper>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <AuthPhoneField isSignIn={isSignIn} />
          <StyledConfirmButton
            disabled={false}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignIn ? 'Войти' : 'Создать аккаунт'}
          </StyledConfirmButton>
        </StyledForm>
      </FormContainer>
    </FormGridWrapper>
  );
};
export default AuthForm;
