import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfilePageWrapper = styled(Box)(() => ({
  padding: `${Rem(100)} ${Rem(15)}`,
  display: 'grid',
  gridTemplateColumns: '1fr 0.7fr',
  maxWidth: Rem(1100),
  margin: '0 auto',
  columnGap: Rem(30),
}));
