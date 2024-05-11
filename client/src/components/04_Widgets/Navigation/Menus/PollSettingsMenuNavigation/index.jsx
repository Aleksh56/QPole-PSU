import { Close as CloseIcon, Publish as PublishIcon } from '@mui/icons-material';
import { Button, IconButton, Stack, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { publishPollFx } from './model/publish-poll';
import { StyledNavContainer } from './styled';

import FrmShare from '@/components/04_Widgets/Data/Forms/frmShare';
import PollSettingsMenuBtn from '@/components/07_Shared/UIComponents/Buttons/pollSettingsMenuBtn';
import { useAlert } from '@/hooks/useAlert';
import usePollData from '@/hooks/usePollData';

const PollSettingsMenuNavigation = ({ buttons }) => {
  const { id } = useParams();
  const { pollStatus } = usePollData(id);
  const { showAlert } = useAlert();
  const [isPublished, setIsPublished] = useState(pollStatus);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

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
        {window.innerWidth < 1000 ? (
          <Tabs
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            sx={{ width: '100%' }}
          >
            {buttons.map((button, index) => (
              <Tab key={button.label} icon={<button.icon />} label={button.label} />
            ))}
            {!isPublished && (
              <Tab
                key="publish"
                icon={<PublishIcon />}
                label="Опубликовать"
                onClick={() => handlePublishPoll()}
              />
            )}
          </Tabs>
        ) : (
          <>
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
              {!isPublished && (
                <Button startIcon={<PublishIcon />} onClick={() => handlePublishPoll()}>
                  Опубликовать
                </Button>
              )}
            </Stack>
            <IconButton onClick={() => navigate(`/app`)}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </StyledNavContainer>
      <FrmShare open={successOpen} setOpen={setSuccessOpen} />
    </>
  );
};

export default PollSettingsMenuNavigation;
