import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { designTokens } from '@/constants/designTokens';

export const StyledNavLink = styled(NavLink)(({ isDisabled }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `${Rem(1)} solid #dbdbdb`,
  backgroundColor: '#fff',
  borderRadius: Rem(5),
  cursor: !isDisabled ? 'poiner' : 'default',
  fontSize: Rem(14),
  padding: `0 ${Rem(12)}`,
  transition: 'all .3s ease',
  '&:hover': {
    backgroundColor: !isDisabled ? '#eee' : '#fff',
  },
  '&.active': {
    '& svg': {
      fill: designTokens.colors.primaryBlue,
    },
  },
}));

export const StyledButton = styled(Button)(({ isDisabled }) => ({
  color: '#343434',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: !isDisabled ? 'inherit' : '#fff',
  },
}));
