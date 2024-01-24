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
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const AppHeader = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuth(false);
    navigate('/');
  };

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
            <MenuItem>
              <Button>Profile</Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={() => handleLogOut()}>Log out</Button>
            </MenuItem>
          </Menu>
        </Dropdown>
      </StyledHeaderContainer>
    </StyledHeaderWrapper>
  );
};

export default AppHeader;
