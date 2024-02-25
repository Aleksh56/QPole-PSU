import styled from '@emotion/styled';
import { Box, Card, Chip, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const StyledChip = styled(Chip)(() => ({
  position: 'absolute',
  top: Rem(10),
  left: Rem(10),
  color: 'white',
  backgroundColor: designTokens.colors.primaryBlue,
  height: Rem(22),
  '& .MuiChip-label': {
    fontSize: Rem(10),
  },
}));

export const StyledCard = styled(Card)(() => ({
  maxWidth: Rem(300),
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

export const StyledTypographyName = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
}));
