import React, { useState } from 'react';
import { FormContainer, FormGridWrapper, StyledForm } from './styled';
import PasswordResetHeading from '@/features/PasswordResetHeading';
import { useNavigate } from 'react-router-dom';
import {
  checkResetPasswordCode,
  resetPasswordRequest,
  sendResetPasswordCode,
} from '@/api/api';
import useAuth from '@/hooks/useAuth';
import { ThemeProvider, useTheme } from '@mui/material';
import LabeledInput from '@/shared/LabeledInput';
import PasswordResetButtons from '@/features/PasswordResetButtons';

const PasswordResetForm = () => {
  const resetPasswordFormTheme = useTheme();
  const [isEmailSubmitted, setEmailSubmitted] = useState(false);
  const [isCodeSubmitted, setCodeSubmitted] = useState(false);
  const [resetAccountEmail, setResetAccountEmail] = useState('');
  const [resetAccountPasswordToken, setResetAccountPasswordToken] =
    useState('');
  const [resetAccountCode, setResetAccountCode] = useState();
  const [resetAccountNewPassword, setResetAccountNewPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setEmailSubmitted(true);
    sendResetPasswordCode({ email: resetAccountEmail });
  };

  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    const checkCodeResponse = await checkResetPasswordCode({
      email: resetAccountEmail,
      reset_code: resetAccountCode,
    });
    if (checkCodeResponse.ok) {
      setCodeSubmitted(true);
      setResetAccountPasswordToken(checkCodeResponse.data.reset_token || '');
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const successReset = await resetPasswordRequest({
      email: resetAccountEmail,
      new_password: resetAccountNewPassword,
      reset_token: resetAccountPasswordToken,
    });
    if (successReset.ok) {
      setAuth(successReset.data.auth_token || '');
      navigate('/app');
    }
  };

  return (
    <ThemeProvider theme={resetPasswordFormTheme}>
      <FormGridWrapper item>
        <FormContainer>
          <PasswordResetHeading />
          <StyledForm
            onSubmit={
              isEmailSubmitted
                ? isCodeSubmitted
                  ? handlePasswordReset
                  : handleCodeSubmit
                : handleEmailSubmit
            }
          >
            {!isEmailSubmitted && (
              <LabeledInput
                label="Введите вашу почту"
                required={true}
                id="email"
                autoComplete="email"
                placeholder="example@mail.ru"
                value={resetAccountEmail}
                handleChange={setResetAccountEmail}
              />
            )}
            {isEmailSubmitted && !isCodeSubmitted && (
              <LabeledInput
                label="Введите код восстановления"
                required={true}
                id="code"
                autoComplete="one-time-code"
                placeholder="000-000"
                value={resetAccountCode}
                handleChange={setResetAccountCode}
              />
            )}
            {isCodeSubmitted && (
              <LabeledInput
                label="Новый пароль"
                required={true}
                id="new-password"
                autoComplete="new-password"
                placeholder="Пароль"
                value={resetAccountNewPassword}
                handleChange={setResetAccountNewPassword}
              />
            )}

            <PasswordResetButtons
              confirmCaption="Отправить"
              returnCaption="Вернуться назад"
              isConfirmDisabled={false}
              returnClick={navigate('/signin')}
            />
          </StyledForm>
        </FormContainer>
      </FormGridWrapper>
    </ThemeProvider>
  );
};

export default PasswordResetForm;
