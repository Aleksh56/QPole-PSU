import { Close as CloseIcon, Publish as PublishIcon } from '@mui/icons-material';
import { Box, IconButton, Stack, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { publishPollFx } from './model/publish-poll';
import { StyledNavContainer } from './styled';

import FrmShare from '@/components/04_Widgets/Data/Forms/frmShare';
import PollSettingsMenuBtn from '@/components/07_Shared/UIComponents/Buttons/pollSettingsMenuBtn';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';
import { useAlert } from '@/hooks/useAlert';
import usePollData from '@/hooks/usePollData';

const PollSettingsMenuNavigation = ({ buttons }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pollStatus } = usePollData(id);
  const { showAlert } = useAlert();
  const [isPublished, setIsPublished] = useState(pollStatus);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [frmShareCapt, setFrmShareCapt] = useState('');

  useEffect(() => {
    setIsPublished(pollStatus);
  }, [pollStatus]);

  const handlePublishPoll = async () => {
    const data = await publishPollFx({ id });
    if (data.severity === 'success') {
      setFrmShareCapt('Опрос успешно опубликован !');
      setSuccessOpen(true);
      setIsPublished(true);
    } else {
      showAlert(data.message, data.severity);
    }
  };

  const handleShareOpen = () => {
    setFrmShareCapt('Поделитесь вашим опросом !');
    setSuccessOpen(true);
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
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
              {!isPublished && (
                <PrimaryButton handleClick={() => handlePublishPoll()} caption="Опубликовать" />
              )}
              {isPublished && (
                <PrimaryButton
                  style={{ alignSelf: 'end' }}
                  caption="Поделиться"
                  handleClick={() => handleShareOpen()}
                />
              )}
              <IconButton onClick={() => navigate(`/app`)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </>
        )}
      </StyledNavContainer>
      <FrmShare open={successOpen} setOpen={setSuccessOpen} caption={frmShareCapt} />
    </>
  );
};

export default PollSettingsMenuNavigation;
