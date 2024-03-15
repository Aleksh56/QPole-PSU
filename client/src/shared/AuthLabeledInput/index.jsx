import React from 'react';
import { StyledPasswordWrapper } from './styled';
import { TextField, Typography } from '@mui/material';

const LabeledInput = ({
  label = '',
  required = true,
  autoComplete = '',
  id = '',
  placeholder = '',
  value,
  handleChange,
  children,
}) => {
  return (
    <>
      <StyledPasswordWrapper>
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
        {children}
      </StyledPasswordWrapper>
      <TextField
        variant="outlined"
        margin="normal"
        required={required}
        fullWidth
        id={id}
        type={id}
        placeholder={placeholder}
        name={id}
        autoComplete={autoComplete}
        autoFocus
        value={value}
        onChange={(e) => handleChange && handleChange(e.target.value)}
      />
    </>
  );
};

export default LabeledInput;
