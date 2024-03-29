import React from 'react';
import {
  StyledPasswordWrapper,
  StyledTextField,
  StyledTypography,
} from './styled';
import { Box } from '@mui/material';

const ProfileAccountField = ({
  label = '',
  required = true,
  id = '',
  placeholder = '',
  value,
  handleChange,
  disabled = false,
  children,
}) => {
  return (
    <>
      <Box sx={{ display: 'grid' }}>
        <StyledPasswordWrapper>
          <StyledTypography variant="body1" gutterBottom>
            {label}
          </StyledTypography>
          {children}
        </StyledPasswordWrapper>
        <StyledTextField
          disabled={disabled}
          variant="outlined"
          margin="normal"
          required={required}
          fullWidth
          id={id}
          placeholder={placeholder}
          name={id}
          autoFocus
          value={value}
          onChange={(e) => handleChange && handleChange(e.target.value)}
        />
      </Box>
    </>
  );
};

export default ProfileAccountField;
