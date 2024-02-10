import React from 'react';
import { Stack, TextField } from '@mui/material';
import { poleDesignFieldData } from './data/PoleDesignFieldData';

const PoleDesignSettingsTab = () => {
  return (
    <Stack spacing={2}>
      {poleDesignFieldData.map(({ label, name }) => (
        <TextField
          key={name}
          fullWidth
          label={label}
          variant="outlined"
          type="color"
        />
      ))}
    </Stack>
  );
};

export default PoleDesignSettingsTab;
