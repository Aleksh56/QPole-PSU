import styled from '@emotion/styled';
import { Box, Grid } from '@mui/material';

export const StyledAuthWrapper = styled(Box)(() => ({
  width: '100vw',
  height: '100vh',
  maxWidth: '100vw',
  maxHeight: '100vh',
}));

export const OverlayWrapper = styled(Grid)(() => ({
  width: '100vw',
  height: '100vh',
  position: 'relative',
}));
