import React from 'react';
import ProfileSidebar from '@/widgets/profile/ProfileSidebar';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { SidebarLinksData } from './data/SidebarLinksData';
import ProfileAboutPage from '../ProfileAbout';
import usePageTitle from '@/hooks/usePageTitle';

const ProfileAppPage = () => {
  usePageTitle('profile');
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Box sx={{ width: '20%', flexShrink: 0 }}>
        <ProfileSidebar linksData={SidebarLinksData} />
      </Box>
      <Box sx={{ flex: 1, backgroundColor: '#f7f9fa', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<ProfileAboutPage />} />
          <Route path="/contributors" element={'Contributors'} />
          <Route path="/statistics" element={'Statistics'} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProfileAppPage;
