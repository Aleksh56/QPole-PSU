import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton, List, ListItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';

import { StyledNavigation, StyledNavigationLink } from './styled';

import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';
import { commonHeaderLinksData } from '@/data/navigation';
import useAuth from '@/hooks/useAuth';

const HeaderNavOut = ({ children, isMobile }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setIsDrawerOpen(open);
  };

  return (
    <StyledNavigation>
      {isMobile ? (
        <>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            // onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton> */}
          <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: '200px', height: '100%' }}>
              <IconButton
                onClick={() => setIsDrawerOpen(false)}
                style={{ position: 'absolute', right: 8, top: 8, zIndex: 1001 }}
              >
                <CloseIcon />
              </IconButton>
              <List style={{ width: '200px', height: '100%' }}>
                {commonHeaderLinksData.map((item) => {
                  return (
                    <ListItem key={v4()}>
                      <StyledNavigationLink key={v4()} to={item.to}>
                        {item.caption}
                      </StyledNavigationLink>
                    </ListItem>
                  );
                })}
                <Box sx={{ display: 'grid', rowGap: '20px', padding: '0 16px' }}>
                  <PrimaryButton caption={t('button.createQuiz')} to="/signup" />
                  <PrimaryButton
                    caption={isAuthenticated ? t('button.profile') : t('button.login')}
                    to={isAuthenticated ? '/app' : '/signin'}
                  />
                </Box>
              </List>
            </Box>
          </Drawer>
        </>
      ) : (
        <>
          {commonHeaderLinksData.map((item) => {
            return (
              <StyledNavigationLink key={v4()} to={item.to}>
                {item.caption}
              </StyledNavigationLink>
            );
          })}
          {children}
        </>
      )}
    </StyledNavigation>
  );
};

export default HeaderNavOut;
