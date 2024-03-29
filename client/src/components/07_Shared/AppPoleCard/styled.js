import styled from '@emotion/styled';
import { Card, Chip, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledChip = styled(Chip)(() => ({
  color: 'white',
  backgroundColor: colorConfig.primaryBlue,
  height: Rem(22),
  '& .MuiChip-label': {
    fontSize: Rem(12),
  },
}));

export const StyledCard = styled(Card)(() => ({
  height: Rem(280),
  width: Rem(550),
  borderRadius: Rem(16),
  boxShadow: 'none',
  display: 'grid',
  gridTemplateColumns: '0.9fr 1fr',
  border: `1px solid ${colorConfig.primaryGray}`,
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

export const StyledTypographyName = styled(Typography)(() => ({
  color: '#aaa',
  fontSize: Rem(12),
  marginBottom: Rem(10),
}));
