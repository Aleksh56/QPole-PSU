import styled from '@emotion/styled';
import { Box, Button, Card, CardContent } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledAddButton = styled(Button)(() => ({
  marginBottom: Rem(10),
  width: '100%',
  padding: Rem(10),
  borderColor: colorConfig.primaryBlue,
  color: colorConfig.primaryBlue,
}));

export const StyledCard = styled(Card)(({ selected }) => ({
  marginBottom: Rem(5),
  boxShadow: selected ? 'none' : 3,
  border: selected ? '1px solid blue' : 'none',
  cursor: 'pointer',
}));

export const StyledCardContent = styled(CardContent)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const StyledContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));
