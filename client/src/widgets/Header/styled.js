import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { Link } from 'react-router-dom';
import { designTokens } from '@/constants/designTokens';

export const StyledHeader = styled('header')(({ isSticky }) => ({
  padding: `${Rem(20)}`,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background: isSticky ? designTokens.colors.primaryBlue : 'transparent',
  transition: 'background-color 0.3s ease-in-out',
  boxSizing: 'border-box',
  zIndex: 100,
}));

export const StyledLogoLink = styled(Link)(() => ({
  fontSize: Rem(36),
  color: designTokens.colors.primaryBlue,
}));

export const StyledContainer = styled(Box)(() => ({
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: '0 15px',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
}));
