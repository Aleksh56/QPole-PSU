import { Rem } from '@/utils/convertToRem';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const PollListPageContentWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  columnGap: Rem(30),
  alignItems: 'start',
  maxWidth: Rem(1500),
  margin: '0 auto',
  padding: `${Rem(70)} ${Rem(15)}`,
}));

export const ContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '30px',
}));
