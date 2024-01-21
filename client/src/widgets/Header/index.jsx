import React, { useState, useEffect } from 'react';
import { StyledContainer, StyledHeader, StyledLogoLink } from './styled';
import PrimaryButton from '@/shared/PrimaryButton';
import HeaderNavigationOutput from '@features/HeaderNavigationOutput';

const Header = () => {
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
    <StyledHeader isSticky={isSticky}>
      <StyledContainer>
        <StyledLogoLink to="/">QPole</StyledLogoLink>
        <HeaderNavigationOutput
          children={<PrimaryButton caption="Войти" to="/login" />}
        />
      </StyledContainer>
    </StyledHeader>
  );
};

export default Header;
