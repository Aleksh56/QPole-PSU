import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Box } from '@mui/material';

export const PollListGridContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  columnGap: Rem(50),
  rowGap: Rem(25),
  width: '100%',
  '@media (max-width: 1000px)': {
    gridTemplateColumns: '1fr',
    gap: Rem(20),
  },
}));
