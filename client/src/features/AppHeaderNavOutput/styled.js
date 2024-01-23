import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { NavLink } from 'react-router-dom';
import { designTokens } from '@/constants/designTokens';

export const StyledNavigation = styled('nav')(() => ({}));

export const StyledNavigationList = styled('ul')(() => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: Rem(15),
}));

export const StyledNavLink = styled(NavLink)(() => ({
  color: '#909090',
  '&.active': {
    color: designTokens.colors.primaryBlue,
  },
}));
