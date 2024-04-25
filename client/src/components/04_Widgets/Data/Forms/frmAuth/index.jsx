import React, { useState } from 'react';
import { FormContainer, FormGridWrapper, StyledConfirmButton, StyledForm } from './styled';
import AuthFormHeading from '@/components/05_Features/AuthFormHeading';
import { useNavigate } from 'react-router-dom';
import LabeledInput from '@/components/07_Shared/UIComponents/Fields/authLabeledInput';
import { useTranslation } from 'react-i18next';
import { pattern } from '@/config/validation.patterns';
import { validateField } from '@/utils/js/validateField';
import { useAlert } from '@/app/context/AlertProvider';
import { ThemeProvider, useTheme } from '@emotion/react';

const FrmAuth = ({ isSignIn, handleFormSwitch = () => {}, handleFormSubmit = () => {} }) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    number: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showAlert('Это сообщение об успехе тест', 'success');

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
    <ThemeProvider theme={theme}>
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
                handleChange={handleInputChange}
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
export default FrmAuth;
