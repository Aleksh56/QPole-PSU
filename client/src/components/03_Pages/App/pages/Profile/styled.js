import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const SidebarWrapper = styled(Box)(({ isSideOpen }) => ({
  width: Rem(240),
  flexShrink: 0,
  transition: 'transform 0.3s ease',
  '@media (max-width: 1000px)': {
    position: 'fixed',
    height: '100%',
    top: 0,
    left: 0,
    width: Rem(240),
    transform: isSideOpen ? 'translateX(0)' : 'translateX(-100%)',
    zIndex: 1200,
    boxShadow: '2px 0 12px rgba(0,0,0,0.5)',
    backgroundColor: '#fff',
  },
}));
