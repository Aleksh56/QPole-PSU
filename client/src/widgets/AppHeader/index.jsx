import React from 'react';
import { AppHeaderData } from './data/AppHeaderData';
import AppHeaderNavigationOutput from '@/features/AppHeaderNavOutput';
import {
  Listbox,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderProfile,
  StyledHeaderWrapper,
} from './styled';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AppHeader = () => {
  return (
    <StyledHeaderWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogo to="/app">QPole</StyledHeaderLogo>
        <AppHeaderNavigationOutput itemsData={AppHeaderData} />
        <Dropdown>
          <StyledHeaderProfile>
            takvot56@gmail.com
            <ArrowDropDownIcon fontSize="small" />
          </StyledHeaderProfile>
          <Menu slots={{ listbox: Listbox }}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Language settings</MenuItem>
            <MenuItem>Log out</MenuItem>
          </Menu>
        </Dropdown>
      </StyledHeaderContainer>
    </StyledHeaderWrapper>
  );
};

export default AppHeader;
