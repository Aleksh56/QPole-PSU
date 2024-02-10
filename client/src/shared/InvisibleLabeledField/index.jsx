import React from 'react';
import {
  LabeledFieldWrapper,
  StyledInput,
  StyledLabelTypography,
} from './styled';

const InvisibleLabeledField = ({ label, placeholder }) => {
  return (
    <LabeledFieldWrapper>
      <StyledLabelTypography>{label}</StyledLabelTypography>
      <StyledInput fullWidth placeholder={placeholder} />
    </LabeledFieldWrapper>
  );
};

export default InvisibleLabeledField;
