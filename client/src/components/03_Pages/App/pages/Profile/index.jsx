import React, { useEffect, useState } from 'react';
import ProfileSidebar from '@/components/04_Widgets/Navigation/Menus/profileSidebar';
import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { SidebarLinksData } from './data/SidebarLinksData';
import ProfileAboutPage from '../ProfileAbout';
import usePageTitle from '@/hooks/usePageTitle';
import ProfileHelpPage from '../ProfileHelp';
import { SidebarWrapper } from './styled';
import MenuIcon from '@mui/icons-material/Menu';

const ProfileAppPage = () => {
  usePageTitle('profile');
  const [showHeader, setShowHeader] = useState(false);
  const [isSideOpen, setIsSideOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSideOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <SidebarWrapper isSideOpen={isSideOpen}>
        <ProfileSidebar linksData={SidebarLinksData} onClose={toggleSidebar} />
      </SidebarWrapper>
      <Box sx={{ flex: 1, backgroundColor: '#f7f9fa', overflowY: 'auto' }}>
        {showHeader && (
          <Box
            sx={{
              padding: '16px',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MenuIcon onClick={() => toggleSidebar()} />
            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'center' }}>
              QPoll
            </Typography>
            <Box sx={{ width: 48 }}></Box>
          </Box>
        )}
        <Routes>
          <Route path="/" element={<ProfileAboutPage />} />
          <Route path="/contributors" element={'Contributors'} />
          <Route path="/help" element={<ProfileHelpPage />} />
          <Route path="/statistics" element={'Statistics'} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ProfileAppPage;
