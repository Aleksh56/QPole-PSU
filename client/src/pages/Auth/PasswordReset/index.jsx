import React from 'react';
import { OverlayWrapper, StyledAuthWrapper } from '../styled';
import AuthIllustration from '@/features/AuthIllustration';
import PasswordResetForm from '@/widgets/PasswordResetForm';
import { ThemeProvider, useTheme } from '@mui/material';

const PasswordResetPage = () => {
  const resetPasswordTheme = useTheme();
  return (
    <ThemeProvider theme={resetPasswordTheme}>
      <StyledAuthWrapper component="main">
        <OverlayWrapper container>
          <AuthIllustration />
          <PasswordResetForm />
        </OverlayWrapper>
      </StyledAuthWrapper>
    </ThemeProvider>
  );
};

export default PasswordResetPage;
