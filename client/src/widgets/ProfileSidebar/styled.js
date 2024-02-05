import styled from '@emotion/styled';
import { Box, ListItemText, Typography } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';
import { NavLink } from 'react-router-dom';

export const StyledProfileWrapper = styled(Box)(() => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'end',
  padding: `${Rem(18)} ${Rem(24)} ${Rem(24)}`,
  boxShadow: '10px 0px 20px 0px rgba(0,0,0,0.3)',
}));

export const StyledProfileContentWrapper = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledProfileSidebarHeading = styled(ListItemText)(() => ({
  marginBottom: Rem(15),
  '& .MuiTypography-root': {
    fontSize: Rem(24),
    color: '#35383a',
  },
}));

export const StyledNavItem = styled(NavLink)(() => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  columnGap: '15px',
  fontSize: '20px',
  width: '100%',
  borderRadius: Rem(8),
  transition: 'all .3s ease',
  padding: `${Rem(5)}`,
  '&:not(:first-of-type)': {
    marginTop: Rem(10),
  },
  '&:hover': {
    backgroundColor: 'rgba(93,101,252,.3)',
  },
  '&.active': {
    '& .MuiTypography-root, .MuiSvgIcon-root': {
      color: designTokens.colors.primaryBlue,
    },
  },
}));

export const StyledNavItemCaption = styled(ListItemText)(() => ({
  '& .MuiTypography-root': {
    fontSize: Rem(16),
    color: '#000',
  },
}));
