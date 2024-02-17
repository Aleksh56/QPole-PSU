import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { StyledCard, StyledChip, StyledTypographyName } from './styled';

const AppPoleCard = React.memo(({ pollData }) => {
  return (
    <StyledCard>
      <CardMedia sx={{ height: '140px' }} image={pollData.image ?? ''} title="Poll Image">
        <StyledChip label={pollData.poll_type ?? '[]'} />
      </CardMedia>
      <CardContent>
        <StyledTypographyName gutterBottom variant="body1" component="h2">
          {pollData.name ?? 'Опрос'}
        </StyledTypographyName>
        <Typography variant="body2" color="textSecondary" component="p">
          {pollData.poll_type ?? ''}
        </Typography>
      </CardContent>
    </StyledCard>
  );
});

export default AppPoleCard;
