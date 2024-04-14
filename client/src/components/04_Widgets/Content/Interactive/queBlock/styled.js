import { Rem } from '@/utils/convertToRem';
import styled from '@emotion/styled';
import { FormControl } from '@mui/material';

export const StyledFormControl = styled(FormControl)(() => ({
  border: `${Rem(1)} solid #D7D7D7`,
  borderRadius: `${Rem(16)}`,
  padding: Rem(20),
  width: '100%',
  backgroundColor: '#fff',
}));
