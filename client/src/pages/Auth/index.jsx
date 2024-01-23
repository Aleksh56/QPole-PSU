import {
  FormContainer,
  FormGridWrapper,
  FormHeadingContainer,
  IllustrationGridWrapper,
  OverlayWrapper,
  StyledAuthWrapper,
  StyledConfirmButton,
  StyledForm,
} from './styled';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Box, TextField } from '@mui/material';
import AuthIllustration from '@assets/loginIllustration.svg';
import { loginUser, registerUser } from '@/api/api';
import useAuth from '@/hooks/useAuth';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    console.log(path);
    setIsSignIn(path === '/signin');
  }, [path]);

  const handleFormSwitch = useCallback(() => {
    setIsSignIn((prev) => !prev);
    const newPath = isSignIn ? '/signup' : '/signin';
    navigate(newPath);
  }, [isSignIn, navigate]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
        ...(isSignIn ? {} : { tel: event.target.tel.value }),
      };

      const response = isSignIn
        ? await loginUser(formData)
        : await registerUser(formData);

      if (response.auth_token && response.auth_token.length > 0) {
        setAuth(response.auth_token);
        navigate('/app');
      }
    },
    [isSignIn]
  );

  return (
    <StyledAuthWrapper component="main">
      <OverlayWrapper container>
        <IllustrationGridWrapper item>
          <Link to="/">QPole</Link>
          <img src={AuthIllustration} alt="Illustration" />
        </IllustrationGridWrapper>

        <FormGridWrapper item>
          <FormContainer>
            <FormHeadingContainer>
              <Typography variant="h5" gutterBottom>
                {isSignIn ? 'Вход' : 'Регистрация'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <Box>
                  <span>
                    {isSignIn ? 'Нет аккаунта ?' : 'Уже есть аккаунт?'}
                  </span>
                  <button onClick={handleFormSwitch}>
                    {isSignIn ? 'Регистрация' : 'Войти'}
                  </button>
                </Box>
              </Typography>
            </FormHeadingContainer>

            <StyledForm onSubmit={handleFormSubmit}>
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
              {!isSignIn && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="tel"
                  placeholder="Телефон"
                  type="tel"
                  id="tel"
                  autoComplete="tel"
                />
              )}
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
      </OverlayWrapper>
    </StyledAuthWrapper>
  );
};

export default AuthPage;
