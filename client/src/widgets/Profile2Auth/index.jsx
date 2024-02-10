import React from 'react';
import {
  StyledProfileContainer,
  StyledProfileFieldsBox,
} from '@/constants/styles';
import { Box, FormControlLabel } from '@mui/material';
import SecurityIcon from '@assets/security.svg';
import {
  Styled2AuthContainerHeading,
  Styled2AuthHeading,
  Styled2AuthInfo,
  StyledAuthContentWrapper,
  StyledImage,
} from './styled';
import CustomSwitch from '@/shared/Switch';

const Profile2AuthBlock = ({ caption = '' }) => {
  return (
    <StyledProfileContainer>
      <Styled2AuthContainerHeading variant="h6">
        {caption}
      </Styled2AuthContainerHeading>
      <StyledProfileFieldsBox>
        <StyledAuthContentWrapper>
          <StyledImage src={SecurityIcon} alt="Security icon" />
          <Box sx={{ marginRight: '100px' }}>
            <Styled2AuthHeading>
              Двухфакторная аутентификация
            </Styled2AuthHeading>
            <Styled2AuthInfo>
              Добавьте дополнительную безопасность своей учетной записи,
              используя двухфакторную аутентификацию
            </Styled2AuthInfo>
          </Box>
          <FormControlLabel
            control={
              <CustomSwitch focusVisibleClassName={'.Mui-focusVisible'} />
            }
          />
        </StyledAuthContentWrapper>
      </StyledProfileFieldsBox>
    </StyledProfileContainer>
  );
};
export default Profile2AuthBlock;
