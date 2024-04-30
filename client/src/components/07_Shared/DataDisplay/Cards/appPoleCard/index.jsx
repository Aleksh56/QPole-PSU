import zaglushka from '@assets/zaglushka.jpg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';

import { closePollFx } from './model/close-poll';
import { deletePollFx } from './model/delete-poll';
import { duplicatePollFx } from './model/duplicate-poll';
import {
  ActionsWrapper,
  ChipsWrapper,
  StyledCard,
  StyledCardContent,
  StyledCardMedia,
  StyledChip,
  StyledTypographyName,
} from './styled';

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
      <StyledCardMedia
        image={pollData.image ? config.serverUrl.main + pollData.image : zaglushka}
        title="Poll Image"
      />
      <StyledCardContent>
        <ActionsWrapper>
          <ChipsWrapper>
            {pollData.is_anonymous && <StyledChip label="Анонимный" />}
            {cardButton && (
              <StyledChip label={pollData.is_in_production ? 'Открыт' : 'Регистрация'} />
            )}
            {!cardButton && (
              <StyledChip label={!pollData.is_in_production ? 'Недоступен' : 'Доступен'} />
            )}
          </ChipsWrapper>
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
        <Typography>{pollData.description ?? ''}</Typography>
        {cardButton}
      </StyledCardContent>
    </StyledCard>
  );
});

export default AppPoleCard;
