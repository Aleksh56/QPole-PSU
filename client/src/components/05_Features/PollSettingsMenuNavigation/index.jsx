import React from 'react';
import { IconButton, Stack, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PollSettingsMenuBtn from '@/components/07_Shared/UIComponents/Buttons/pollSettingsMenuBtn';
import { StyledNavContainer } from './styled';
import { useNavigate, useParams } from 'react-router-dom';
import { publishPollFx } from './model/publish-poll';
import { useAlert } from '@/app/context/AlertProvider';

const PollSettingsMenuNavigation = ({ buttons }) => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handlePublishPoll = async () => {
    const data = await publishPollFx({ id });
    showAlert(data.message, data.severity);
  };

  return (
    <StyledNavContainer>
      <Stack direction="row" spacing={2}>
        {buttons.map((button) => (
          <PollSettingsMenuBtn
            key={button.label}
            icon={button.icon}
            label={button.label}
            page={button.page}
            disabled={button.disabled}
          />
        ))}
      </Stack>
      <Box>
        <Button onClick={() => handlePublishPoll()}>Опубликовать</Button>
        <IconButton onClick={() => navigate(`/app`)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </StyledNavContainer>
  );
};

export default PollSettingsMenuNavigation;
