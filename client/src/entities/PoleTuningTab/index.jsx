import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CustomSwitch from '@/shared/Switch';
import { StyledFormControlLabel } from '@/constants/styles';
import { v4 } from 'uuid';
import { settings } from './config/PoleTuningSettings';
import { patchPollSettings } from './api/apiRequests';
import { useParams } from 'react-router-dom';

const PoleTuningTab = ({ pollData }) => {
  const { id } = useParams();
  const [localSettings, setLocalSettings] = useState(pollData);

  useEffect(() => {
    setLocalSettings(pollData);
  }, [pollData]);

  const handleSwitchChange = useCallback(
    (s_field) => async (event) => {
      const checked = event.target.checked;
      await patchPollSettings(id, s_field, checked);
      setLocalSettings((prev) => ({ ...prev, [s_field]: checked }));
    },
    []
  );
  return (
    <Box spacing={2}>
      {settings.map((item) => (
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

export default PoleTuningTab;
