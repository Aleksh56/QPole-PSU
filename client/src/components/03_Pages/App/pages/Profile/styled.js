import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const SidebarWrapper = styled(Box)(({ isSideOpen }) => ({
  width: '20%',
  flexShrink: 0,
  '@media (max-width: 1000px)': {
    display: isSideOpen ? 'block' : 'none',
  },
}));
