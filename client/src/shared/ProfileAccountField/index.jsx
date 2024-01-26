import React from 'react';
import {
  StyledPasswordWrapper,
  StyledTextField,
  StyledTypography,
} from './styled';

const ProfileAccountField = ({
  label = '',
  required = true,
  autoComplete = '',
  id = '',
  placeholder = '',
  value,
  handleChange,
  disabled = false,
  children,
}) => {
  return (
    <>
      <StyledPasswordWrapper>
        <StyledTypography variant="subtitle1" gutterBottom>
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
        autoComplete={autoComplete}
        autoFocus
        value={value}
        onChange={(e) => handleChange && handleChange(e.target.value)}
      />
    </>
  );
};

export default ProfileAccountField;
