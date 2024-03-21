import React, { useState } from 'react';
import { CardContent, CardMedia, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { StyledCard, StyledChip, StyledTypographyName } from './styled';
import { deletePollRequest } from './api/apiRequest';
import { closePollFx } from './model/close-poll';
import { duplicatePollFx } from './model/duplicate-poll';

const BASE_IMAGE_URL = 'http://89.111.155.6';

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

  const handleClosePoll = async (e, id) => {
    e.preventDefault();
    await closePollFx(id);
    setAnchorEl(null);
    fetchData();
  };

  const handleDuplicatePoll = async (e, id) => {
    e.preventDefault();
    await duplicatePollFx(id);
    setAnchorEl(null);
    fetchData();
  };

  return (
    <StyledCard>
      <CardMedia
        sx={{ height: '140px', backgroundSize: 'contain' }}
        image={BASE_IMAGE_URL + pollData.image ?? ''}
        title="Poll Image"
      >
        <StyledChip label={pollData.poll_type.name ?? ''} />
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="settings"
          onClick={handleMenuOpen}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={(e) => handleDuplicatePoll(e, pollData.poll_id)}>Дублировать</MenuItem>
          <MenuItem onClick={(e) => handleClosePoll(e, pollData.poll_id)}>Закрыть опрос</MenuItem>
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
