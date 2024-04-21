import React from 'react';
import AuthIllustration from '@/components/05_Features/AuthIllustration';
import FrmResetPass from '@/components/04_Widgets/Data/Forms/frmResetPass';
import { OverlayWrapper, StyledAuthWrapper } from '@/components/03_Pages/Auth/styled';

const FrmRestore = () => {
  return (
    <StyledAuthWrapper component="main">
      <OverlayWrapper container>
        <AuthIllustration />
        <FrmResetPass />
      </OverlayWrapper>
    </StyledAuthWrapper>
  );
};

export default FrmRestore;
