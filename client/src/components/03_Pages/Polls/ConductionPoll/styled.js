import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const ConductionBackgroundWrapper = styled(Box)(() => ({
  backgroundColor: '#FAFAFF',
  height: '100vh',
}));

export const ConductionWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  flexDirection: 'column',
  rowGap: Rem(30),
  maxWidth: Rem(700),
  margin: '0 auto',
  padding: `${Rem(70)} ${Rem(15)}`,
  userSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
}));
