import AppHeader from '@/widgets/AppHeader';
import ProfileAccountInfo from '@/widgets/ProfileAccountInfo';
import ProfileChangeCurrentPass from '@/widgets/ProfileChangeCurrentPass';
import { Box } from '@mui/material';
import React from 'react';

const ProfileAppPage = () => {
  return (
    <>
      <AppHeader />
      <Box
        sx={{
          padding: '100px 15px',
          display: 'grid',
          gridTemplateColumns: '1fr 0.7fr',
          maxWidth: '1100px',
          margin: '0 auto',
          columnGap: '30px',
        }}
      >
        <ProfileAccountInfo />
        <ProfileChangeCurrentPass />
      </Box>
    </>
  );
};

export default ProfileAppPage;
