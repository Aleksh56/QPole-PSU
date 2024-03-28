import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import ColorPicker from '@/components/07_Shared/ColorPicker';
import { pollDesignFieldData } from '@/data/fields';

const PollDesignSettingsTab = () => {
  const handleColorChange = useCallback((name, color) => {
    console.log(name, color);
  }, []);
  return (
    <Grid container spacing={2}>
      {pollDesignFieldData.map(({ label, name }) => (
        <Grid item xs={6} key={name}>
          <ColorPicker label={label} name={name} onChange={handleColorChange} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PollDesignSettingsTab;
