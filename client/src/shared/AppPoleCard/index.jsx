import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';

const AppPoleCard = React.memo(({ imageUrl, pollData }) => {
  return (
    <Card>
      <CardMedia sx={{ height: '140px' }} image={imageUrl} title="Poll Image">
        <Chip
          label={pollData.poll_type}
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {pollData.poll_type ?? ''}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {pollData.poll_type ?? ''}
        </Typography>
      </CardContent>
    </Card>
  );
});

export default AppPoleCard;
