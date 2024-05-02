import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Link } from 'react-router-dom';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledNavigation = styled('nav')(() => ({
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: Rem(30),
  alignItems: 'center',
}));

export const StyledNavigationLink = styled(Link)(() => ({
  color: colorConfig.primaryBlack,
  opacity: '.7',
}));
