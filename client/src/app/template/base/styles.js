import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const WorksWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  textAlign: 'center',
}));

export const TitleText = styled(Typography)(() => ({
  fontSize: '26px',
  fontWeight: 500,
}));

export const InfoText = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: 500,
  color: '#868686',
}));
