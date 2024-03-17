import React, { useState, useEffect } from 'react';
import { StyledContainer, StyledHeader, StyledLogoLink } from './styled';
import PrimaryButton from '@/shared/PrimaryButton';
import HeaderNavigationOutput from '@/components/05_Features/HeaderNavOutput';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';

const Header = ({ isMainPage = true }) => {
  const { t } = useTranslation();
  const [isSticky, setIsSticky] = useState(false);
  const { isAuthenticated } = useAuth();

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
              <PrimaryButton caption={t('button.createQuiz')} to="/signup" />
              <PrimaryButton
                caption={isAuthenticated ? t('button.profile') : t('button.login')}
                to="/signin"
              />
            </Box>
          }
        />
      </StyledContainer>
    </StyledHeader>
  );
};

export default Header;
