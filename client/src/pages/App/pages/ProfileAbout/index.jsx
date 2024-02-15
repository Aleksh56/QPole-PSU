import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledProfileAboutWrapper } from './styled';
import ProfileUserData from '@/widgets/ProfileUserData';
import ProfileTimezone from '@/widgets/ProfileTimezone';
import Profile2AuthBlock from '@/widgets/Profile2Auth';
import useUserData from '@/hooks/useUserData';
import useFormInput from '@/hooks/useFormInput';
import { ProfileInfoFieldsConfig } from './data/ProfileInfoFields';

const ProfileAboutPage = () => {
  const navigate = useNavigate();
  const userData = useUserData();

  const ProfileInfoFields = ProfileInfoFieldsConfig.map((field) => ({
    ...field,
    useHook: useFormInput(field.initialValue),
  }));

  return (
    <StyledProfileAboutWrapper>
      <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => navigate('/app')}>
        <CloseIcon />
      </IconButton>
      <Box>
        <ProfileUserData
          caption="Профиль"
          boxCaption="Данные аккаунта"
          ProfileInfoFields={ProfileInfoFields}
        />
        <ProfileTimezone caption="Язык и страна" selectCaption="Часовой пояс" />
        <Profile2AuthBlock caption="Безопасность" />
      </Box>
    </StyledProfileAboutWrapper>
  );
};

export default ProfileAboutPage;
