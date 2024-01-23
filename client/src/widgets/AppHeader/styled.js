import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { Link } from 'react-router-dom';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu } from '@mui/base/Menu';

export const StyledHeaderWrapper = styled('header')(() => ({
  backgroundColor: '#ebebeb',
}));

export const StyledHeaderContainer = styled(Box)(() => ({
  maxWidth: Rem(1200),
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${Rem(20)} ${Rem(15)}`,
}));

export const StyledHeaderLogo = styled(Link)(() => ({
  fontSize: Rem(32),
  color: '#000',
}));

export const StyledHeaderProfile = styled(MenuButton)(() => ({
  backgroundColor: 'transparent',
  border: 0,
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  columnGap: Rem(10),
  cursor: 'pointer',
}));

export const Listbox = styled('ul')(() => ({
  padding: Rem(6),
  margin: `${Rem(12)} 0`,
  minWidth: Rem(200),
  borderRadius: Rem(4),
  overflow: 'auto',
  outline: 0,
  background: '#fff',
  border: '1px solid gray',
  color: '#000',
  zIndex: 1,
}));
