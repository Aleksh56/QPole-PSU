import { TextField, Typography } from '@mui/material';

const AuthPhoneField = ({ isSignIn }) => {
  return (
    !isSignIn && (
      <>
        <Typography variant="subtitle1" gutterBottom>
          Телефон
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="tel"
          placeholder="Телефон"
          type="tel"
          id="tel"
          autoComplete="tel"
        />
      </>
    )
  );
};

export default AuthPhoneField;
