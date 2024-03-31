import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { StyledDrawerWrapper } from './styled';
import { adminPanelSidebarLinks } from '@/data/onboardings';
import AdminUsersPage from './pages/AdminUsers';
import AdmHeader from '@/components/04_Widgets/admin/admHeader';

const AdminPanelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin-panel/main');
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <StyledDrawerWrapper variant="permanent" anchor="left">
          <Typography variant="h6" noWrap component="div" sx={{ p: 2 }}>
            Админ Панель
          </Typography>
          <List>
            {adminPanelSidebarLinks.map(({ caption, link }) => (
              <ListItem key={caption} disablePadding>
                <ListItemButton onClick={() => navigate(`/admin-panel/${link}`)}>
                  <ListItemText primary={caption} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </StyledDrawerWrapper>
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#F5F6FA' }}>
          <AdmHeader notificationsCount={3} />
          <Box sx={{ padding: '20px' }}>
            <Routes>
              <Route
                path="/main"
                element={<Typography paragraph>Это главная страница.</Typography>}
              />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route
                path="/settings"
                element={<Typography paragraph>Настройки системы.</Typography>}
              />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPanelPage;
