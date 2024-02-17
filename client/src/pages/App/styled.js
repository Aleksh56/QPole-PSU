import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { designTokens } from '@/constants/designTokens';
import { Rem } from '@/utils/convertToRem';

export const StyledAppContentWrapper = styled(Box)(() => ({
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(100)} 0`,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: Rem(30),
}));
