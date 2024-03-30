import styled from '@emotion/styled';
import { Drawer } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { Link } from 'react-router-dom';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledDrawerWrapper = styled(Drawer)(() => ({
  width: Rem(240),
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: Rem(240),
    boxSizing: 'border-box',
  },
}));
