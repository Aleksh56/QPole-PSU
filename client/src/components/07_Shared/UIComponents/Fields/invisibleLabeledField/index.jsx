import React from 'react';
import { LabeledFieldWrapper, StyledInput, StyledLabelTypography } from './styled';

const InvisibleLabeledField = ({ label, placeholder, handleChange = () => {}, value }) => {
  return (
    <LabeledFieldWrapper>
      <StyledLabelTypography>{label}</StyledLabelTypography>
      <StyledInput
        fullWidth
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        value={value}
      />
    </LabeledFieldWrapper>
  );
};

export default InvisibleLabeledField;
