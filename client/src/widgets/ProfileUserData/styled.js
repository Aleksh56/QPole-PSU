import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
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
