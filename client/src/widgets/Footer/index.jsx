import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { StyledFooter, StyledFooterWrapper, StyledLogoLink } from './styled';

const Footer = () => {
  return (
    <StyledFooter>
      <StyledFooterWrapper>
        <StyledLogoLink to="/">QPole</StyledLogoLink>
        <Box>
          <p>Vkontakte</p>
        </Box>
      </StyledFooterWrapper>
    </StyledFooter>
  );
};

export default Footer;
