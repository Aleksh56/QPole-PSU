import styled from '@emotion/styled';
import { Box, TextField, Typography } from '@mui/material';
import { designTokens } from '@/constants/designTokens';
import { Rem } from '@/utils/convertToRem';

export const StyledTypography = styled(Typography)(() => ({
  fontSize: Rem(14),
  marginBottom: Rem(12),
}));

export const StyledTextField = styled(TextField)(() => ({
  margin: `0 0 ${Rem(25)} 0`,
  '& .MuiInputBase-input': {
    margin: 0,
    padding: Rem(8),
  },
}));

export const StyledPasswordWrapper = styled(Box)(() => ({
  display: 'grid',
  width: '100%',
  alignItems: 'center',
  gridTemplateColumns: '1fr auto',
  '& .MuiTypography-root': {
    marginBottom: Rem(8),
  },
  '& button': {
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    color: designTokens.colors.primaryBlue,
  },
}));
