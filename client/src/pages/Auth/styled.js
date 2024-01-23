import styled from '@emotion/styled';
import { Box, Button, Grid } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const StyledAuthWrapper = styled(Box)(() => ({
  width: '100vw',
  height: '100vh',
  maxWidth: '100vw',
  maxHeight: '100vh',
}));

export const OverlayWrapper = styled(Grid)(() => ({
  width: '100vw',
  height: '100vh',
  position: 'relative',
}));

export const IllustrationGridWrapper = styled(Grid)(() => ({
  // ToDo - rewrite flex -> grid
  display: 'flex',
  flexDirection: 'column',
  padding: Rem(60),
  backgroundColor: designTokens.colors.primaryBlue,
  flexBasis: '70%',
  maxWidth: '70%',
  '& a': {
    fontSize: Rem(36),
    color: '#000',
  },
  '& img': {
    maxWidth: '50%',
    height: '100%',
    alignSelf: 'center',
  },
}));

export const FormGridWrapper = styled(Grid)(() => ({
  flexBasis: '30%',
  maxWidth: '100%',
}));

export const FormContainer = styled(Grid)(() => ({
  padding: `0 ${Rem(50)}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const FormHeadingContainer = styled(Box)(() => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'auto',
  '& h5': {
    fontSize: Rem(32),
    fontWeight: 600,
  },
  '& p div': {
    display: 'flex',
    columnGap: Rem(10),
  },
  '& button': {
    border: 0,
    backgroundColor: 'transparent',
    color: designTokens.colors.primaryBlue,
    cursor: 'pointer',
  },
}));

export const StyledForm = styled('form')(() => ({
  '& .MuiFormControl-root': {
    margin: `${Rem(8)} 0`,
  },
  '& .MuiInputBase-root': {
    borderRadius: Rem(12),
    fontSize: Rem(16),
  },
  '& .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
    {
      border: `2px solid ${designTokens.colors.primaryBlue}`,
    },
}));

export const StyledConfirmButton = styled(Button)(({ disabled }) => ({
  marginTop: Rem(30),
  height: Rem(48),
  borderRadius: Rem(30),
  backgroundColor: designTokens.colors.primaryBlue,
  opacity: disabled ? '0.7' : '1',
  color: '#fff',
}));
