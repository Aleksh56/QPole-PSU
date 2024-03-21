import React, { useEffect, useState } from 'react';
import { StyledPasswordWrapper } from './styled';
import { TextField, Typography } from '@mui/material';
import InputMask from 'react-input-mask';

const LabeledInput = ({
  label = '',
  required = true,
  autoComplete = '',
  id = '',
  placeholder = '',
  value,
  handleChange,
  children,
  errorMessage = '',
}) => {
  const [error, setError] = useState(!!errorMessage);

  useEffect(() => {
    setError(!!errorMessage);
  }, [errorMessage]);

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
        error={error}
        value={value}
        onChange={(e) => handleChange(e)}
        helperText={error ? errorMessage : ''}
      />
    </>
  );
};

export default LabeledInput;
