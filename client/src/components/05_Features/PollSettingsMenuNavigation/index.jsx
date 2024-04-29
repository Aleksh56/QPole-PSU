import React, { useEffect, useState } from 'react';
import { IconButton, Stack, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PollSettingsMenuBtn from '@/components/07_Shared/UIComponents/Buttons/pollSettingsMenuBtn';
import { StyledNavContainer } from './styled';
import { useNavigate, useParams } from 'react-router-dom';
import { publishPollFx } from './model/publish-poll';
import { useAlert } from '@/app/context/AlertProvider';
import FrmShare from '@/components/04_Widgets/Data/Forms/frmShare';
import usePollData from '@/hooks/usePollData';

const PollSettingsMenuNavigation = ({ buttons }) => {
  const { id } = useParams();
  const { pollStatus } = usePollData(id);
  const { showAlert } = useAlert();
  const [isPublished, setIsPublished] = useState(pollStatus);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPublished(pollStatus);
  }, [pollStatus]);

  const handlePublishPoll = async () => {
    const data = await publishPollFx({ id });
    if (data.severity === 'success') {
      setSuccessOpen(true);
      setIsPublished(true);
    } else {
      showAlert(data.message, data.severity);
    }
  };

  return (
    <>
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
          {!isPublished && <Button onClick={() => handlePublishPoll()}>Опубликовать</Button>}
          <IconButton onClick={() => navigate(`/app`)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledNavContainer>
      <FrmShare open={successOpen} setOpen={setSuccessOpen} />
    </>
  );
};

export default PollSettingsMenuNavigation;
