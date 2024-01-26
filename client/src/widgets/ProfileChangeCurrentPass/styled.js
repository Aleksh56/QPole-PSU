import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfileChangePassWrapper = styled(Box)(() => ({
  boxShadow: '0px 6px 30px 0px rgba(0,0,0,0.75)',
  borderRadius: Rem(8),
  width: '100%',
}));

export const StyledProfileChangePassContent = styled(Box)(() => ({
  padding: Rem(20),
}));

export const StyledProfileChangePassTypography = styled(Typography)(() => ({
  marginBottom: Rem(30),
}));

export const StyledProfileLastPass = styled(Box)(() => ({
  paddingBottom: Rem(0),
  borderBottom: '1px solid #aaa',
}));

export const StyledProfileNewPass = styled(Box)(() => ({
  paddingTop: Rem(15),
}));
