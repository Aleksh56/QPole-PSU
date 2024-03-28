import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { ColorPickerWrapper, StyledColorTextField, StyledColorTypography } from './styled';

const ColorPicker = React.memo(({ label, name, onChange }) => {
  const [color, setColor] = useState('#000000');

  const handleChange = useCallback(
    (color) => {
      setColor(color);
      onChange(name, color);
    },
    [name, onChange]
  );

  return (
    <Box>
      <StyledColorTypography>{label}</StyledColorTypography>
      <ColorPickerWrapper onClick={() => document.getElementById(`color-input-${name}`).click()}>
        <StyledColorTextField
          key={name}
          fullWidth
          type="color"
          onChange={(e) => handleChange(e.target.value)}
        />
        <Typography>{color}</Typography>
      </ColorPickerWrapper>
    </Box>
  );
});

export default ColorPicker;
