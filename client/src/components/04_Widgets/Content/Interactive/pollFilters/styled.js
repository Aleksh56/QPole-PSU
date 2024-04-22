import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const FiltersWrapper = styled(Box)(() => ({
  width: '100%',
  border: '1px solid black',
  borderRadius: Rem(10),
  position: 'sticky',
  top: Rem(20),
  zIndex: 1000,
  backgroundColor: '#fff',
  marginBottom: Rem(20),
  padding: 2,
}));

export const FiltersButton = styled(Button)(() => ({
  width: '100%',
  justifyContent: 'center',
  py: 2,
}));
