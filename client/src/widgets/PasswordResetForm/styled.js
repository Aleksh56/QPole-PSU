import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';
import { Box, Button, Grid } from '@mui/material';

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

export const StyledForm = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: '100%',
  '& .MuiTypography-root': {
    margin: 0,
  },
  '& .MuiFormControl-root': {
    margin: `0 0 ${Rem(8)} 0`,
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
  marginTop: Rem(16),
  height: Rem(48),
  borderRadius: Rem(30),
  backgroundColor: designTokens.colors.primaryBlue,
  opacity: disabled ? '0.7' : '1',
  color: '#fff',
}));

export const StyledReturnButton = styled(Button)(() => ({
  marginTop: Rem(16),
  height: Rem(48),
  borderRadius: Rem(30),
  backgroundColor: designTokens.colors.primaryBlue,
  color: '#fff',
}));

export const StyledButtonsWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: Rem(20),
}));
