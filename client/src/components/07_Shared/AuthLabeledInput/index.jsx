import React, { useEffect, useState } from 'react';
import { StyledPasswordWrapper } from './styled';
import { TextField, Typography } from '@mui/material';
import MaskedInput from 'react-text-mask';

const TextMaskCustom = React.forwardRef((props, ref) => {
  const { mask, onChange, ...other } = props;
  console.log(other);
  console.log('Received mask:', mask);

  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={mask}
      placeholderChar={'\u2000'}
      keepCharPositions={true}
      onChange={handleChange}
    />
  );
});

const LabeledInput = ({
  label = '',
  required = true,
  autoComplete = '',
  id = '',
  placeholder = '',
  mask = null,
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
        name={id}
        autoComplete={autoComplete}
        autoFocus
        error={error}
        value={value}
        type={id}
        onChange={handleChange}
        helperText={error ? errorMessage : ''}
        placeholder={placeholder}
        // InputProps={{
        //   inputComponent: mask ? TextMaskCustom : undefined,
        //   inputProps: {
        //     mask: Array.isArray(mask) ? mask : [],
        //     onChange: handleChange,
        //   },
        // }}
      />
    </>
  );
};

export default LabeledInput;
