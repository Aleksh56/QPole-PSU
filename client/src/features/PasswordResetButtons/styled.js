import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';
import { Box, Button } from '@mui/material';

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
