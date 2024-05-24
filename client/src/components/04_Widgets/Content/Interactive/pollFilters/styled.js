import styled from '@emotion/styled';
import { Box, Button, FormGroup } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const FiltersWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid black',
  borderRadius: Rem(10),
  backgroundColor: '#fff',
  marginBottom: Rem(20),
  padding: Rem(10),
  '@media (max-width: 1000px)': {
    display: 'block',
    position: 'sticky',
    top: Rem(20),
    zIndex: 1000,
  },
}));

export const StyledFormGroup = styled(FormGroup)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const FiltersButton = styled(Button)(() => ({
  width: '100%',
  justifyContent: 'center',
  py: 2,
}));
