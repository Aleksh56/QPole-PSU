import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const ListWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(20)} 15px`,
  columnGap: Rem(30),
  '@media (max-width: 1000px)': {
    alignItems: 'center',
    flexDirection: 'column',
    margin: 0,
    maxWidth: 'unset',
    columnGap: 0,
    padding: 0,
  },
}));

export const LoaderWrapper = styled(Box)(({ matches }) => ({
  overflow: 'hidden',
  padding: matches ? '0 15px' : 0,
  height: matches ? '100vh' : 'auto',
}));
