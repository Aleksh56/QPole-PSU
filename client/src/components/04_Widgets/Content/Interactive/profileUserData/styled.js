import styled from '@emotion/styled';
import { Avatar, Box, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfileContainer = styled(Box)(() => ({
  maxWidth: Rem(580),
  margin: '0 auto',
  padding: '50px 20px 0 20px',
}));

export const StyledProfileAvatar = styled(Avatar)(() => ({
  width: 90,
  height: 90,
  marginTop: Rem(24),
  '&:hover': {
    opacity: 0.7,
    cursor: 'pointer',
  },
}));

export const ProfileTitle = styled(Typography)(() => ({
  fontSize: '24px',
}));

export const BoxCaption = styled(Typography)(() => ({
  marginTop: '48px',
  fontSize: '18px',
  lineHeight: '24px',
}));

export const ProfileFieldsWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  rowGap: '15px',
}));
