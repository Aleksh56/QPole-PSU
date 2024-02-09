import styled from '@emotion/styled';
import { Box, Switch, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const Styled2AuthContainerHeading = styled(Typography)(() => ({
  marginTop: '48px',
  fontSize: '18px',
  lineHeight: '24px',
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

export const IOSSwitch = styled(Switch)(() => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: designTokens.colors.primaryBlue,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: 'grey',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#c6c6c6',
    opacity: 1,
    transition: 'all .5s ease',
  },
}));
