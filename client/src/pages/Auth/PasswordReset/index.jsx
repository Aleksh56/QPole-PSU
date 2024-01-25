import React from 'react';
import { OverlayWrapper, StyledAuthWrapper } from '../styled';
import AuthIllustration from '@/features/AuthIllustration';
import PasswordResetForm from '@/widgets/PasswordResetForm';

const PasswordResetPage = () => {
  return (
    <StyledAuthWrapper component="main">
      <OverlayWrapper container>
        <AuthIllustration />
        <PasswordResetForm />
      </OverlayWrapper>
    </StyledAuthWrapper>
  );
};

export default PasswordResetPage;
