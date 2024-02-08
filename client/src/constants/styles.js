import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfileContainer = styled(Box)(() => ({
  maxWidth: Rem(580),
  margin: '0 auto',
  padding: '0 20px 0 20px',
}));

export const StyledProfileFieldsBox = styled(Box)(() => ({
  marginTop: Rem(12),
  marginBottom: Rem(10),
  padding: Rem(15),
  backgroundColor: '#fff',
  boxShadow:
    '0px 1px 3px rgba(140,148,155,0.1),0px 5px 10px rgba(140,148,155,0.08)',
  borderRadius: Rem(10),
}));
