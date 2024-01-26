import React from 'react';
import AuthIllustrationImage from '@assets/loginIllustration.svg';
import { IllustrationGridWrapper } from './styled';
import { Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material';

const AuthIllustration = () => {
  const authIllustrationTheme = useTheme();
  return (
    <ThemeProvider theme={authIllustrationTheme}>
      <IllustrationGridWrapper item>
        <Link to="/">QPole</Link>
        <img src={AuthIllustrationImage} alt="Illustration" />
      </IllustrationGridWrapper>
    </ThemeProvider>
  );
};

export default AuthIllustration;
