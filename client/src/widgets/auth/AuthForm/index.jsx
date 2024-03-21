import React, { useState } from 'react';
import { FormContainer, FormGridWrapper, StyledConfirmButton, StyledForm } from './styled';
import AuthFormHeading from '@/components/05_Features/AuthFormHeading';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material';
import LabeledInput from '@/shared/AuthLabeledInput';
import { useTranslation } from 'react-i18next';
import { pattern } from '@/config/validation.patterns';
import { validateField } from '@/utils/js/validateField';

const AuthForm = ({ isSignIn, handleFormSwitch = () => {}, handleFormSubmit = () => {} }) => {
  const authFormTheme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailError = validateField(
      formValues.email,
      pattern.email,
      'Некорректный адрес электронной почты'
    );
    const passwordError = validateField(
      formValues.password,
      pattern.passwordLowerAndUpper,
      'Пароль должен содержать минимум 8 символов, включая строчные и заглавные буквы'
    );

    setFormErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      handleFormSubmit(formValues);
    }
  };

  const handleInputChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <ThemeProvider theme={authFormTheme}>
      <FormGridWrapper item>
        <FormContainer>
          <AuthFormHeading isSignIn={isSignIn} handleFormSwitch={handleFormSwitch} />
          <StyledForm onSubmit={handleSubmit}>
            <LabeledInput
              label="Ваша почта"
              required={true}
              autoComplete="email"
              id="email"
              placeholder="Эл. почта"
              handleChange={handleInputChange}
              errorMessage={formErrors.email}
            />
            <LabeledInput
              label="Пароль"
              required={true}
              autoComplete="current-password"
              id="password"
              placeholder="Пароль"
              handleChange={handleInputChange}
              errorMessage={formErrors.password}
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
                id="number"
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
