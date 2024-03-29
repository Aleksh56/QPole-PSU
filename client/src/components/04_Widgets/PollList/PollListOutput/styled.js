import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Grid } from '@mui/material';

export const PollListGridContainer = styled(Grid)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: Rem(50),
  rowGap: Rem(25),
}));
