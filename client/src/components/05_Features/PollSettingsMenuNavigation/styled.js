import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledNavContainer = styled(Box)(() => ({
  maxWidth: Rem(1200),
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Rem(20)} ${Rem(15)}`,
}));
