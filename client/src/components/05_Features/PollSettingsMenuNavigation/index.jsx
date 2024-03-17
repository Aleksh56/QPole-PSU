import React from 'react';
import { IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PoleSettingsMenuButton from '@/shared/PoleSettingsMenuButton';
import { StyledNavContainer } from './styled';
import { useNavigate, useParams } from 'react-router-dom';

const PollSettingsMenuNavigation = ({ buttons }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <StyledNavContainer>
      <Stack direction="row" spacing={2}>
        {buttons.map((button) => (
          <PoleSettingsMenuButton
            key={button.label}
            icon={button.icon}
            label={button.label}
            page={button.page}
            disabled={button.disabled}
          />
        ))}
      </Stack>
      <IconButton onClick={() => navigate(`/app`)}>
        <CloseIcon />
      </IconButton>
    </StyledNavContainer>
  );
};

export default PollSettingsMenuNavigation;
