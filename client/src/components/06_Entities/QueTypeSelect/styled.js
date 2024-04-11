import styled from '@emotion/styled';
import { Select } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { colorConfig } from '@/app/template/config/color.config';

export const TypeSelect = styled(Select)(() => ({
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
  },
}));
