import { Rem } from '@/utils/convertToRem';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const PollListPageContentWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  columnGap: Rem(30),
  alignItems: 'start',
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(70)} ${Rem(15)}`,
}));
