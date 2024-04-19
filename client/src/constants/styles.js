import styled from '@emotion/styled';
import { Box, Button, FormControlLabel, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const StyledProfileContainer = styled(Box)(() => ({
  maxWidth: Rem(580),
  margin: '0 auto',
  padding: '50px 20px 0 20px',
  '@media (max-width: 768px)': {
    padding: '25px 20px 0 20px',
  },
}));

export const StyledProfileFieldsBox = styled(Box)(() => ({
  marginTop: Rem(12),
  marginBottom: Rem(10),
  padding: Rem(15),
  backgroundColor: '#fff',
  boxShadow: '0px 1px 3px rgba(140,148,155,0.1),0px 5px 10px rgba(140,148,155,0.08)',
  borderRadius: Rem(10),
}));

export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  maxWidth: 'max-content',
  '& .MuiTypography-root': {
    fontSize: '14px',
    color: '#909090',
  },
}));

// First block (if not created smth yet)

export const StyledFirstHeroWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: Rem(30),
  alignItems: 'center',
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(70)} ${Rem(15)}`,
}));

export const StyledFirstLeftColumn = styled(Box)(() => ({
  textAlign: 'left',
}));

export const StyledFirstTypography = styled(Typography)(() => ({
  marginBottom: Rem(45),
  fontSize: Rem(34),
  fontWeight: 700,
  color: '#515151',
}));

export const StyledFirstButton = styled(Button)(() => ({
  backgroundColor: '#007bff',
  color: '#fff',
  padding: `${Rem(10)} ${Rem(20)}`,
  border: 'none',
  cursor: 'pointer',
}));

export const StyledFirstInfoWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 0.75fr',
  columnGap: Rem(15),
  alignItems: 'center',
}));
