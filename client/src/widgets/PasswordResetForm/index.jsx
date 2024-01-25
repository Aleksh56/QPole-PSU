import React, { useState } from 'react';
import {
  FormContainer,
  FormGridWrapper,
  StyledButtonsWrapper,
  StyledConfirmButton,
  StyledForm,
  StyledReturnButton,
} from './styled';
import PasswordResetHeading from '@/features/PasswordResetHeading';
import PasswordResetCodeField from '@/features/PasswordResetCodeField';
import PasswordResetNewPassFields from '@/features/PasswordResetNewPassFields';
import PasswordResetEmailField from '@/features/PasswordResetEmailField';
import { useNavigate } from 'react-router-dom';
import {
  checkResetPasswordCode,
  resetPasswordRequest,
  sendResetPasswordCode,
} from '@/api/api';
import useAuth from '@/hooks/useAuth';

const PasswordResetForm = () => {
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
            <PasswordResetEmailField
              onResetAccountEmailChange={setResetAccountEmail}
              resetAccountEmailChangeState={resetAccountEmail}
            />
          )}
          {isEmailSubmitted && !isCodeSubmitted && (
            <PasswordResetCodeField
              onResetAccountCodeChange={setResetAccountCode}
              resetAccountCode={resetAccountCode}
            />
          )}
          {isCodeSubmitted && (
            <PasswordResetNewPassFields
              setResetAccountNewPassword={setResetAccountNewPassword}
              resetAccountNewPassword={resetAccountNewPassword}
            />
          )}
          <StyledButtonsWrapper>
            <StyledReturnButton
              type="button"
              fullWidth
              variant="contained"
              onClick={() => navigate('/signin')}
            >
              Вернуться назад
            </StyledReturnButton>
            <StyledConfirmButton
              disabled={false}
              type="submit"
              fullWidth
              variant="contained"
            >
              Отправить
            </StyledConfirmButton>
          </StyledButtonsWrapper>
        </StyledForm>
      </FormContainer>
    </FormGridWrapper>
  );
};

export default PasswordResetForm;
