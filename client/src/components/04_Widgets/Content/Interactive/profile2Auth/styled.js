import styled from '@emotion/styled';
import { Box, Switch, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const Styled2AuthContainerHeading = styled(Typography)(() => ({
  marginTop: '48px',
  fontSize: '18px',
  lineHeight: '24px',
  '@media (max-width: 768px)': {
    marginTop: '20px',
  },
}));

export const StyledAuthContentWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
}));

export const StyledImage = styled('img')(() => ({
  width: Rem(70),
  height: Rem(70),
  marginRight: '15px',
}));

export const Styled2AuthHeading = styled(Typography)(() => ({
  fontSize: Rem(14),
  fontWeight: 400,
  color: '#35383a',
  marginBottom: Rem(5),
}));

export const Styled2AuthInfo = styled(Typography)(() => ({
  fontSize: Rem(11),
  fontWeight: 400,
  color: '#697074',
  lineHeight: Rem(14),
}));
