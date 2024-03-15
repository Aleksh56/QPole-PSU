import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomSwitch from '@/shared/Switch';
import { StyledFormControlLabel } from '@/constants/styles';
import { v4 } from 'uuid';
import usePollSettings from './hooks/usePollSettings';
import { pollTuningSettings } from '@/data/fields';

const PollTuningTab = ({ pollData }) => {
  const [localSettings, handleSwitchChange] = usePollSettings(pollData);

  return (
    <Box spacing={2}>
      {pollTuningSettings.map((item) => (
        <Box sx={{ borderBottom: '1px solid #e2e2e2', paddingBottom: '15px', marginTop: '10px' }}>
          <Typography sx={{ marginBottom: '10px' }}>{item.heading}</Typography>
          {item.switchSettings.map((item) => (
            <StyledFormControlLabel
              key={v4()}
              control={
                <CustomSwitch
                  focusVisibleClassName={item.label}
                  onChange={handleSwitchChange(item.id)}
                  checked={localSettings ? localSettings[item.id] ?? false : false}
                />
              }
              label={item.label}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default PollTuningTab;
