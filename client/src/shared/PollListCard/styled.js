import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Box, Button, Card, Typography } from '@mui/material';
import { colorConfig } from '@/app/template/config/color.config';

export const CardWrapper = styled(Card)(() => ({
  display: 'flex',
  width: '100%',
  padding: Rem(15),
}));

export const CardContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  height: Rem(150),
}));

export const CardTitle = styled(Typography)(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: Rem(16),
  fontWeight: '600',
}));

export const CardDescription = styled(Typography)(() => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  fontSize: Rem(12),
  color: '#aaa',
}));

export const CardButton = styled(Button)(({ isAuthenticated, participated }) => ({
  border: `1px solid ${isAuthenticated && !participated ? colorConfig.primaryBlue : '#aaa'}`,
  borderRadius: Rem(20),
  color: colorConfig.primaryBlue,
  fontSize: Rem(13),
  textTransform: 'initial',
}));
