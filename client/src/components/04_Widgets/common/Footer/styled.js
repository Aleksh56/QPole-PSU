import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

export const StyledFooter = styled('footer')(() => ({
  backgroundColor: '#181824',
  padding: `${Rem(40)} 0`,
}));

export const StyledFooterWrapper = styled(Box)(() => ({
  padding: `0 ${Rem(15)}`,
  maxWidth: Rem(1200),
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  color: '#fff',
}));

export const StyledLogoLink = styled(Link)(() => ({
  fontSize: Rem(32),
  color: '#fff',
}));
