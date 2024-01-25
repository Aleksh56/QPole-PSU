import React from 'react';
import {
  FormContainer,
  FormGridWrapper,
  StyledConfirmButton,
  StyledForm,
  StyledPasswordWrapper,
} from './styled';
import { TextField, Typography } from '@mui/material';
import AuthFormHeading from '@/features/AuthFormHeading';
import AuthPhoneField from '@/features/AuthPhoneField';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({
  isSignIn,
  handleFormSwitch = () => {},
  handleFormSubmit = () => {},
}) => {
  const navigate = useNavigate();
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
            {isSignIn ? (
              <button onClick={() => navigate('/password-reset')}>
                Забыли пароль?
              </button>
            ) : (
              ''
            )}
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
