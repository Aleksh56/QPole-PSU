import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

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

export const Stld2AuthInfoWrapper = styled(Box)(() => ({
  marginRight: '100px',
  '@media (max-width: 768px)': {
    marginRight: '50px',
  },
  '@media (max-width: 450px)': {
    marginRight: '20px',
  },
}));
