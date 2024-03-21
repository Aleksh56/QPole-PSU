import React, { useState, useEffect } from 'react';
import { StyledContainer, StyledHeader, StyledLogoLink } from './styled';
import PrimaryButton from '@/shared/PrimaryButton';
import HeaderNavigationOutput from '@/components/05_Features/HeaderNavOutput';
import { Box, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const Header = ({ isMainPage = true }) => {
  const { t } = useTranslation();
  const [isSticky, setIsSticky] = useState(false);
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledHeader isSticky={isSticky} isMainPage={isMainPage}>
      <StyledContainer>
        <StyledLogoLink to="/">QPoll</StyledLogoLink>
        <HeaderNavigationOutput
          children={
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '12px' }}>
              {isMobile && (
                <>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </Menu>
                </>
              )}
              <PrimaryButton caption={t('button.createQuiz')} to="/signup" />
              <PrimaryButton
                caption={isAuthenticated ? t('button.profile') : t('button.login')}
                to={isAuthenticated ? '/app' : '/signin'}
              />
            </Box>
          }
        />
      </StyledContainer>
    </StyledHeader>
  );
};

export default Header;
