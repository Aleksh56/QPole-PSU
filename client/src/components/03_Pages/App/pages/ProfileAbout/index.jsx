import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledProfileAboutWrapper } from './styled';
import ProfileUserData from '@/components/04_Widgets/Content/Interactive/profileUserData';
import ProfileTimezone from '@/components/04_Widgets/Content/Interactive/profileTimezone';
import Profile2AuthBlock from '@/components/04_Widgets/Content/Interactive/profile2Auth';
import { ProfileInfoFieldsConfig } from './data/ProfileInfoFields';
import useUserData from '@/hooks/useUserData';

const ProfileAboutPage = () => {
  const navigate = useNavigate();
  const userData = useUserData();

  const profileInfoFields = userData
    ? ProfileInfoFieldsConfig.map((field) => ({
        ...field,
        initialValue: userData[field.key],
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
          user_id={userData?.user.id}
        />
        <ProfileTimezone caption="Язык и страна" selectCaption="Часовой пояс" />
        <Profile2AuthBlock caption="Безопасность" />
      </Box>
    </StyledProfileAboutWrapper>
  );
};

export default ProfileAboutPage;
