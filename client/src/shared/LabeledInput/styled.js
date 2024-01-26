import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { designTokens } from '@/constants/designTokens';

export const StyledPasswordWrapper = styled(Box)(() => ({
  display: 'grid',
  width: '100%',
  alignItems: 'center',
  gridTemplateColumns: '1fr auto',
  '& button': {
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    color: designTokens.colors.primaryBlue,
  },
}));