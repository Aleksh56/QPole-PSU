import { Rem } from '@/utils/convertToRem';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ConductionWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  flexDirection: 'column',
  rowGap: Rem(30),
  maxWidth: Rem(500),
  margin: '0 auto',
  padding: `${Rem(70)} ${Rem(15)}`,
}));
