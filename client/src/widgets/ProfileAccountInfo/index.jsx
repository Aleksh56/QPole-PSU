import ProfileAccountField from '@/shared/ProfileAccountField';
import { Box } from '@mui/material';
import React from 'react';
import {
  StyledProfileContent,
  StyledProfileInfoWrapper,
  StyledProfileTypography,
} from './styled';

const ProfileAccountInfo = () => {
  return (
    <StyledProfileInfoWrapper>
      <StyledProfileContent>
        <StyledProfileTypography variant="h5">Аккаунт</StyledProfileTypography>
        <Box>
          <ProfileAccountField
            label="Электронная почта"
            autoComplete="email"
            id="email"
            placeholder="example@mail.ru"
            disabled={true}
          />
          <ProfileAccountField
            label="Имя и фамилия"
            autoComplete="email"
            id="fio"
            placeholder="Ваше имя и фамилия"
          />
          <ProfileAccountField
            label="Ваш никнейм"
            autoComplete="email"
            id="username"
            placeholder="Nickname"
          />
        </Box>
      </StyledProfileContent>
    </StyledProfileInfoWrapper>
  );
};

export default ProfileAccountInfo;
