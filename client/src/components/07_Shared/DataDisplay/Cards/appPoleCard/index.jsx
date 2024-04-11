import React, { useState } from 'react';
import { Typography, Menu, MenuItem, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  ActionsWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardMedia,
  StyledChip,
  StyledTypographyName,
} from './styled';
import { closePollFx } from './model/close-poll';
import { duplicatePollFx } from './model/duplicate-poll';
import config from '@/config';
import { deletePollFx } from './model/delete-poll';

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
    await deletePollFx(pollData?.poll_id).then(() => {
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
      <StyledCardMedia image={config.serverUrl.main + pollData.image} title="Poll Image" />
      <StyledCardContent>
        <ActionsWrapper>
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
        </ActionsWrapper>
        <StyledTypographyName gutterBottom>{pollData.poll_type ?? ''}</StyledTypographyName>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{pollData.name ?? ''}</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#4C4C4C', marginTop: '10px' }}>
          {pollData.description ??
            'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.'}
        </Typography>
        {cardButton}
      </StyledCardContent>
    </StyledCard>
  );
});

export default AppPoleCard;
