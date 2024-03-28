import styled from '@emotion/styled';
import { Box, TextField, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledColorTypography = styled(Typography)(() => ({
  color: '#6f6f6f',
  fontSize: Rem(14),
}));

export const ColorPickerWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #c6ced9',
  marginTop: Rem(10),
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: Rem(10),
}));

export const StyledColorTextField = styled(TextField)(() => ({
  width: '40px',
  '& .MuiInputBase-input': {
    padding: 0,
    width: '40px',
    height: '40px',
    cursor: 'pointer',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none',
  },
}));
