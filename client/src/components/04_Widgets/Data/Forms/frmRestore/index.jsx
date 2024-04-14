import React from 'react';
import AuthIllustration from '@/components/05_Features/AuthIllustration';
import FrmResetPass from '@/components/04_Widgets/Data/Forms/frmResetPass';
import { ThemeProvider, useTheme } from '@mui/material';
import { OverlayWrapper, StyledAuthWrapper } from '@/components/03_Pages/Auth/styled';

const FrmRestore = () => {
  const resetPasswordTheme = useTheme();
  return (
    <ThemeProvider theme={resetPasswordTheme}>
      <StyledAuthWrapper component="main">
        <OverlayWrapper container>
          <AuthIllustration />
          <FrmResetPass />
        </OverlayWrapper>
      </StyledAuthWrapper>
    </ThemeProvider>
  );
};

export default FrmRestore;
