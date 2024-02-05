import React from 'react';
import ProfileSidebar from '@/widgets/ProfileSidebar';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { SidebarLinksData } from './data/SidebarLinksData';
import ProfileAboutPage from '../ProfileAbout';

const ProfileAppPage = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Box sx={{ width: '20%', flexShrink: 0 }}>
        <ProfileSidebar linksData={SidebarLinksData} />
      </Box>
      <Box sx={{ flex: 1, backgroundColor: '#f7f9fa' }}>
        <Routes>
          <Route path="/" element={<ProfileAboutPage />} />
          <Route path="/contributors" element={'Contributors'} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProfileAppPage;
