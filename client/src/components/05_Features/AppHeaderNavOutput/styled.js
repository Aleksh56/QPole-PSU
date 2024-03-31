import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { NavLink } from 'react-router-dom';
import { designTokens } from '@/constants/designTokens';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledNavigation = styled('nav')(() => ({}));

export const StyledNavigationList = styled('ul')(() => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: Rem(15),
  '& a:not(:last-child)': {
    paddingRight: Rem(15),
    borderRight: '2px solid #D4D4D4',
  },
}));

export const StyledNavLink = styled(NavLink)(() => ({
  color: '#909090',
  '&.active': {
    color: colorConfig.primaryBlue,
  },
}));
