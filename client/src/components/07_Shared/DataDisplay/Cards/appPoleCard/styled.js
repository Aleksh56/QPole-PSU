import styled from '@emotion/styled';
import { Card, Chip, Typography, CardMedia, CardContent, Box } from '@mui/material';
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
  maxHeight: Rem(280),
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

export const StyledCardMedia = styled(CardMedia)(() => ({
  backgroundSize: 'contain',
  padding: Rem(25),
  borderRadius: Rem(16),
}));

export const StyledCardContent = styled(CardContent)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
}));

export const ActionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: Rem(20),
  width: '100%',
}));

export const StyledTypographyName = styled(Typography)(() => ({
  color: '#aaa',
  fontSize: Rem(12),
  marginBottom: Rem(10),
}));
