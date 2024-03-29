import React from 'react';
import {
  BoxCaption,
  ProfileFieldsWrapper,
  ProfileTitle,
  StyledProfileAvatar,
  StyledProfileContainer,
} from './styled';
import ProfileAccountField from '@/components/07_Shared/ProfileAccountField';
import { StyledProfileFieldsBox } from '@/constants/styles';

const ProfileUserData = ({ caption = '', boxCaption = '', ProfileInfoFields = [] }) => {
  console.log(ProfileInfoFields);
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
            ProfileInfoFields.map(({ label, id, initialValue }) => (
              <ProfileAccountField
                key={id}
                label={label}
                required={false}
                id={id}
                value={initialValue}
                // handleChange={useHook.onChange}
              />
            ))}
        </ProfileFieldsWrapper>
      </StyledProfileFieldsBox>
    </StyledProfileContainer>
  );
};

export default ProfileUserData;
