import ProfileAccountField from '@/shared/ProfileAccountField';
import { Box, Typography } from '@mui/material';
import React from 'react';

const ProfileAccountInfo = () => {
  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
      <Typography variant="h5">Аккаунт</Typography>
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
    </Box>
  );
};

export default ProfileAccountInfo;
