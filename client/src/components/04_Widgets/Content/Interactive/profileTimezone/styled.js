import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const SelectedTimezoneText = styled(Typography)(() => ({
  marginTop: '48px',
  fontSize: '18px',
  lineHeight: '24px',
  '@media (max-width: 768px)': {
    marginTop: '20px',
  },
}));
