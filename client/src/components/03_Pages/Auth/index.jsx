import { OverlayWrapper, StyledAuthWrapper } from './styled';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser } from '@/api/api';
import useAuth from '@/hooks/useAuth';
import AuthForm from '@/widgets/auth/AuthForm';
import AuthIllustration from '@/components/05_Features/AuthIllustration';
import { ThemeProvider, useTheme } from '@mui/material';
import usePageTitle from '@/hooks/usePageTitle';

const AuthPage = () => {
  const authTheme = useTheme();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = useMemo(() => location.pathname, [location.pathname]);
  const [isSignIn, setIsSignIn] = useState(path === '/signin');
  usePageTitle(isSignIn ? 'login' : 'signup');

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) navigate('/app');
  }, [navigate]);

  const handleFormSwitch = useCallback(() => {
    setIsSignIn((prev) => !prev);
    navigate(isSignIn ? '/signup' : '/signin');
  }, [isSignIn, navigate]);

  const handleFormSubmit = useCallback(
    async (event) => {
      console.log(event);
      const formData = {
        email: event.email,
        password: event.password,
        ...(isSignIn ? {} : { number: event.number }),
      };

      const response = isSignIn ? await loginUser(formData) : await registerUser(formData);

      if (response.data.access_token && response.data.access_token.length > 0) {
        setAuth(response.data.access_token);
        navigate('/app');
      }
    },
    [isSignIn]
  );

  return (
    <ThemeProvider theme={authTheme}>
      <StyledAuthWrapper component="main">
        <OverlayWrapper container>
          <AuthIllustration />
          <AuthForm
            isSignIn={isSignIn}
            handleFormSwitch={handleFormSwitch}
            handleFormSubmit={handleFormSubmit}
          />
        </OverlayWrapper>
      </StyledAuthWrapper>
    </ThemeProvider>
  );
};

export default AuthPage;
