import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const ListWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(20)} 0`,
  columnGap: Rem(30),
}));
