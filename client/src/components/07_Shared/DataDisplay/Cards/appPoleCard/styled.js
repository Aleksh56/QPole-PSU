import styled from '@emotion/styled';
import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';

import { colorConfig } from '@/app/template/config/color.config';
import { Rem } from '@/utils/convertToRem';

export const StyledChip = styled(Chip)(() => ({
  color: 'white',
  backgroundColor: colorConfig.primaryBlue,
  height: Rem(22),
  '& .MuiChip-label': {
    fontSize: Rem(12),
  },
}));

export const StyledCard = styled(Card)(() => ({
  borderRadius: Rem(16),
  boxShadow: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr', // Equal division for two columns
  border: `1px solid ${colorConfig.primaryGray}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  minHeight: Rem(280), // Set a minimum height to avoid compression
  width: '100%', // Card width is flexible within grid column

  '&:hover': {
    transform: 'translateY(-8px)',
  },

  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
  },
}));

export const StyledCardMedia = styled(CardMedia)(() => ({
  backgroundSize: 'cover',
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

export const ChipsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  columnGap: Rem(5),
}));

export const StyledTypographyName = styled(Typography)(() => ({
  color: '#aaa',
  fontSize: Rem(12),
  marginBottom: Rem(10),
}));
