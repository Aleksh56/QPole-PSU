import React, { useEffect, useState } from 'react';
import {
  BoxCaption,
  ProfileFieldsWrapper,
  ProfileTitle,
  StyledProfileAvatar,
  StyledProfileContainer,
} from './styled';
import ProfileAccountField from '@/components/07_Shared/ProfileAccountField';
import { StyledProfileFieldsBox } from '@/constants/styles';
import { changeUserDataFx } from './models/change-user-data';

const ProfileUserData = ({ caption = '', boxCaption = '', ProfileInfoFields = [], user_id }) => {
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    const initialFieldValues = ProfileInfoFields.reduce((acc, { key, initialValue }) => {
      acc[key] = initialValue;
      return acc;
    }, {});

    setFieldValues(initialFieldValues);
  }, [ProfileInfoFields]);

  const handleFieldChange = async (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
    changeUserDataFx({ user_id, field, value });
  };

  return (
    <StyledProfileContainer>
      <ProfileTitle variant="h4" gutterBottom>
        {caption}
      </ProfileTitle>
      <StyledProfileAvatar src="/path/to/anonymous-avatar.png" alt="Анонимный профиль" />
      <BoxCaption variant="h6" gutterBottom>
        {boxCaption}
      </BoxCaption>
      <StyledProfileFieldsBox>
        <ProfileFieldsWrapper>
          {ProfileInfoFields &&
            ProfileInfoFields.map(({ label, id, disabled, key }) => (
              <ProfileAccountField
                key={id}
                label={label}
                required={false}
                id={id}
                value={fieldValues[key]}
                fieldKey={key}
                handleChange={handleFieldChange}
                isDisabled={disabled}
              />
            ))}
        </ProfileFieldsWrapper>
      </StyledProfileFieldsBox>
    </StyledProfileContainer>
  );
};

export default ProfileUserData;
