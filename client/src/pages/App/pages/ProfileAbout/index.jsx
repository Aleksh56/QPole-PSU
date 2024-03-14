import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledProfileAboutWrapper } from './styled';
import ProfileUserData from '@/widgets/profile/ProfileUserData';
import ProfileTimezone from '@/widgets/profile/ProfileTimezone';
import Profile2AuthBlock from '@/widgets/profile/Profile2Auth';
import { ProfileInfoFieldsConfig } from './data/ProfileInfoFields';
import useUserData from '@/hooks/useUserData';
import { get } from 'lodash';

const ProfileAboutPage = () => {
  const navigate = useNavigate();
  const userData = useUserData();

  const profileInfoFields = userData
    ? ProfileInfoFieldsConfig.map((field) => ({
        ...field,
        initialValue: get(userData, field.key, field.initialValue),
      }))
    : [];

  return (
    <StyledProfileAboutWrapper>
      <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => navigate('/app')}>
        <CloseIcon />
      </IconButton>
      <Box>
        <ProfileUserData
          caption="Профиль"
          boxCaption="Данные аккаунта"
          ProfileInfoFields={profileInfoFields}
        />
        <ProfileTimezone caption="Язык и страна" selectCaption="Часовой пояс" />
        <Profile2AuthBlock caption="Безопасность" />
      </Box>
    </StyledProfileAboutWrapper>
  );
};

export default ProfileAboutPage;
