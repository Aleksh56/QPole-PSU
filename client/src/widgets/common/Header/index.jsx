import React, { useState, useEffect } from 'react';
import { StyledContainer, StyledHeader, StyledLogoLink } from './styled';
import PrimaryButton from '@/shared/PrimaryButton';
import HeaderNavigationOutput from '@/components/05_Features/HeaderNavOutput';
import { Box } from '@mui/material';

const Header = ({ isMainPage = true }) => {
  const [isSticky, setIsSticky] = useState(false);

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

  return (
    <StyledHeader isSticky={isSticky} isMainPage={isMainPage}>
      <StyledContainer>
        <StyledLogoLink to="/">QPoll</StyledLogoLink>
        <HeaderNavigationOutput
          children={
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '12px' }}>
              <PrimaryButton caption="Создать квиз" to="/signup" />
              <PrimaryButton caption="Войти" to="/signin" />
            </Box>
          }
        />
      </StyledContainer>
    </StyledHeader>
  );
};

export default Header;
