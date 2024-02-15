import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import { poleDesignFieldData } from './data/PoleDesignFieldData';
import ColorPicker from '@/shared/ColorPicker';

const PoleDesignSettingsTab = () => {
  const handleColorChange = useCallback((name, color) => {
    console.log(name, color);
  }, []);
  return (
    <Grid container spacing={2}>
      {poleDesignFieldData.map(({ label, name }) => (
        <Grid item xs={6} key={name}>
          <ColorPicker label={label} name={name} onChange={handleColorChange} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PoleDesignSettingsTab;
