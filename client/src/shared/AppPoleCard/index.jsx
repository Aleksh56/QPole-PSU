import React, { useState } from 'react';
import { CardContent, CardMedia, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { StyledCard, StyledChip, StyledTypographyName } from './styled';
import { deletePollRequest } from './api/apiRequest';

const AppPoleCard = React.memo(({ pollData, fetchData }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  const handleDeletePoll = async (e) => {
    e.preventDefault();
    await deletePollRequest(pollData?.poll_id).then(() => {
      fetchData();
    });
  };

  return (
    <StyledCard>
      <CardMedia sx={{ height: '140px' }} image={pollData.image ?? ''} title="Poll Image">
        <StyledChip label={pollData.poll_type.name ?? ''} />
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="settings"
          onClick={handleMenuOpen}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Пункт 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Пункт 2</MenuItem>
          <MenuItem onClick={(e) => handleDeletePoll(e)}>Удалить</MenuItem>
        </Menu>
      </CardMedia>
      <CardContent>
        <StyledTypographyName gutterBottom variant="body1" component="h2">
          {pollData.name ?? 'Опрос'}
        </StyledTypographyName>
        <Typography variant="body2" color="textSecondary" component="p">
          {pollData.poll_type.name ?? ''}
        </Typography>
      </CardContent>
    </StyledCard>
  );
});

export default AppPoleCard;
