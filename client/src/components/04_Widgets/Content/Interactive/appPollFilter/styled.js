import styled from '@emotion/styled';
import { Box, Button, Stack } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const StyledStackWrapper = styled(Box)(() => ({
  width: '100%',
  boxShadow: '1px 20px 20px 0 #00000030',
  // '@media (max-width: 900px)': {
  //   display: 'none',
  // },
}));

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(5,1fr)',
  columnGap: Rem(20),
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(15)}`,
  '& .MuiInputBase-input, .MuiSelect-select': {
    padding: `${Rem(8)} ${Rem(10)} ${Rem(8)} ${Rem(20)}`,
  },
  '@media (max-width: 1300px)': {
    maxWidth: Rem(1000),
  },
  '@media (max-width: 1100px)': {
    maxWidth: Rem(760),
  },
  '@media (max-width: 900px)': {
    display: 'none',
  },
}));

export const StyledButton = styled(Button)(() => ({
  textTransform: 'initial',
  marginLeft: Rem(40),
  '@media (max-width: 1300px)': {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    width: '100%',
    fontSize: Rem(12),
    padding: 0,
  },
}));

export const MobileFiltersWrapper = styled('div')(({ show }) => ({
  display: show ? 'block' : 'none',
  '@media (min-width: 901px)': {
    display: 'none',
  },
}));

export const StyledMobileButton = styled(Button)(() => ({
  display: 'none',
  '@media (max-width: 900px)': {
    display: 'block',
  },
}));
