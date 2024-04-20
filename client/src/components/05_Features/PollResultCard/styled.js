import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const CardWrapper = styled(Box)(() => ({
  padding: Rem(20),
  boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
  borderRadius: Rem(10),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const CardInfoWrapper = styled(Box)(() => ({
  alignSelf: 'flex-start',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const CardHeading = styled(Typography)(() => ({
  fontSize: Rem(15),
  fontWeight: 600,
}));

export const CardAnswersCount = styled(Typography)(() => ({
  fontSize: Rem(13),
}));

export const InfoButton = styled(Button)(() => ({
  fontSize: Rem(14),
  textTransform: 'none',
  textDecoration: 'underline',
  color: '#aaa',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));
