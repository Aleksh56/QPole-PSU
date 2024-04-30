import { LabeledFieldWrapper, StyledInput, StyledLabelTypography } from './styled';

const InvisibleLabeledField = ({
  label,
  placeholder,
  handleChange = () => {},
  value,
  type,
  max,
  min,
}) => {
  return (
    <LabeledFieldWrapper>
      <StyledLabelTypography>{label}</StyledLabelTypography>
      <StyledInput
        id={type}
        fullWidth
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        value={value}
        type={type}
        inputProps={{ max: max, min: min }}
      />
    </LabeledFieldWrapper>
  );
};

export default InvisibleLabeledField;
