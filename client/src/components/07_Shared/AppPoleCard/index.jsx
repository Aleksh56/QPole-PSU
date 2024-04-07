import React, { useState } from 'react';
import { CardContent, CardMedia, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { StyledCard, StyledChip, StyledTypographyName } from './styled';
import { deletePollRequest } from './api/apiRequest';
import { closePollFx } from './model/close-poll';
import { duplicatePollFx } from './model/duplicate-poll';
import config from '@/config';

const AppPoleCard = React.memo(({ pollData, fetchData, cardButton }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
        sx={{ backgroundSize: 'contain', padding: '25px', borderRadius: '16px' }}
        image={config.serverUrl.main + pollData.image}
        title="Poll Image"
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Box
          sx={{
            marginBottom: '20px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <StyledChip label={!pollData.is_closed ? 'Открыт' : 'Закрыт'} />

          {!cardButton && (
            <Box zIndex="tooltip">
              <MoreHorizIcon onClick={handleMenuOpen} />
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={(e) => handleClosePoll(e, pollData.poll_id)}>
                  Close Poll
                </MenuItem>
                <MenuItem onClick={(e) => handleDuplicatePoll(e, pollData.poll_id)}>
                  Duplicate Poll
                </MenuItem>
                <MenuItem onClick={(e) => handleDeletePoll(e)}>Delete Poll</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
        <StyledTypographyName gutterBottom>{pollData.poll_type ?? ''}</StyledTypographyName>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{pollData.name ?? ''}</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#4C4C4C', marginTop: '10px' }}>
          {pollData.description ??
            'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'}
        </Typography>
        {cardButton}
      </CardContent>
    </StyledCard>
  );
});

export default AppPoleCard;
