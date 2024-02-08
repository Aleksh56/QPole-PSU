import React from 'react';
import { StyledProfileAvatar, StyledProfileContainer } from './styled';
import ProfileAccountField from '@/shared/ProfileAccountField';
import { Box, Typography } from '@mui/material';
import { StyledProfileFieldsBox } from '@/constants/styles';

const ProfileUserData = ({
  caption = '',
  boxCaption = '',
  ProfileInfoFields = [],
}) => {
  return (
    <StyledProfileContainer>
      <Typography variant="h4" sx={{ fontSize: '24px' }} gutterBottom>
        {caption}
      </Typography>
      <StyledProfileAvatar
        src="/path/to/anonymous-avatar.png"
        alt="Анонимный профиль"
      />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ marginTop: '48px', fontSize: '18px', lineHeight: '24px' }}
      >
        {boxCaption}
      </Typography>
      <StyledProfileFieldsBox>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '15px' }}
        >
          {ProfileInfoFields.map(({ label, id, useHook }) => (
            <ProfileAccountField
              key={id}
              label={label}
              required={false}
              id={id}
              value={useHook.value}
              handleChange={useHook.onChange}
            />
          ))}
        </Box>
      </StyledProfileFieldsBox>
    </StyledProfileContainer>
  );
};

export default ProfileUserData;
