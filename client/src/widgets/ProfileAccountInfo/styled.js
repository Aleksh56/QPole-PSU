import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfileInfoWrapper = styled(Box)(() => ({
  boxShadow: '0px 6px 30px 0px rgba(0,0,0,0.75)',
  borderRadius: Rem(8),
  width: '100%',
}));

export const StyledProfileContent = styled(Box)(() => ({
  padding: Rem(20),
}));

export const StyledProfileTypography = styled(Typography)(() => ({
  marginBottom: Rem(30),
}));
