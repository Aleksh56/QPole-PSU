import React from 'react';
import { FormContainer, FormGridWrapper, StyledConfirmButton, StyledForm } from './styled';
import AuthFormHeading from '@/components/05_Features/AuthFormHeading';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material';
import LabeledInput from '@/shared/AuthLabeledInput';
import { useTranslation } from 'react-i18next';

const AuthForm = ({ isSignIn, handleFormSwitch = () => {}, handleFormSubmit = () => {} }) => {
  const authFormTheme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={authFormTheme}>
      <FormGridWrapper item>
        <FormContainer>
          <AuthFormHeading isSignIn={isSignIn} handleFormSwitch={handleFormSwitch} />
          <StyledForm onSubmit={handleFormSubmit}>
            <LabeledInput
              label="Ваша почта"
              required={true}
              autoComplete="email"
              id="email"
              placeholder="Эл. почта"
            />
            <LabeledInput
              label="Пароль"
              required={true}
              autoComplete="current-password"
              id="password"
              placeholder="Пароль"
              children={
                isSignIn ? (
                  <button onClick={() => navigate('/password-reset')}>Забыли пароль?</button>
                ) : (
                  ''
                )
              }
            />
            {!isSignIn && (
              <LabeledInput
                label="Телефон"
                required={true}
                autoComplete="tel"
                id="tel"
                placeholder="Телефон"
              />
            )}
            <StyledConfirmButton disabled={false} type="submit" fullWidth variant="contained">
              {isSignIn ? t('button.login') : t('button.signup')}
            </StyledConfirmButton>
          </StyledForm>
        </FormContainer>
      </FormGridWrapper>
    </ThemeProvider>
  );
};
export default AuthForm;
