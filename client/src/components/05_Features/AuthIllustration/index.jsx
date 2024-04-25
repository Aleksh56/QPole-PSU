import React from 'react';
import AuthIllustrationImage from '@assets/loginIllustration.svg';
import { IllustrationGridWrapper } from './styled';
import { Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@emotion/react';

const AuthIllustration = () => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <IllustrationGridWrapper item>
        <Link to="/">QPoll</Link>
        <img src={AuthIllustrationImage} alt="Illustration" />
      </IllustrationGridWrapper>
    </ThemeProvider>
  );
};

export default AuthIllustration;
