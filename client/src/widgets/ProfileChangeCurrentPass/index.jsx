import ProfileAccountField from '@/shared/ProfileAccountField';
import React from 'react';
import {
  StyledProfileChangePassContent,
  StyledProfileChangePassTypography,
  StyledProfileChangePassWrapper,
  StyledProfileLastPass,
  StyledProfileNewPass,
} from './styled';

const ProfileChangeCurrentPass = () => {
  return (
    <StyledProfileChangePassWrapper>
      <StyledProfileChangePassContent>
        <StyledProfileChangePassTypography variant="h5">
          Смена пароля
        </StyledProfileChangePassTypography>
        <StyledProfileLastPass>
          <ProfileAccountField
            label="Старый пароль"
            required={true}
            autoComplete="current-password"
            id="current-profile-password"
            placeholder="Введите старый пароль"
          />
        </StyledProfileLastPass>
        <StyledProfileNewPass>
          <ProfileAccountField
            label="Новый пароль"
            required={true}
            autoComplete="new-password"
            id="new-profile-password"
            placeholder="Введите новый пароль"
          />
        </StyledProfileNewPass>
      </StyledProfileChangePassContent>
    </StyledProfileChangePassWrapper>
  );
};

export default ProfileChangeCurrentPass;
