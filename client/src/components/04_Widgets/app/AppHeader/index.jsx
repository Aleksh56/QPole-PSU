import React from 'react';
import AppHeaderNavigationOutput from '@/components/05_Features/AppHeaderNavOutput';
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
import useUserData from '@/hooks/useUserData';
import { appHeaderData } from '@/data/fields';
import { useUserRole } from '@/app/context/UserRoleProvider';

const AppHeader = () => {
  const { role } = useUserRole();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const userData = useUserData();

  const handleLogOut = () => {
    setAuth(false);
    navigate('/');
  };

  return (
    <StyledHeaderWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogo to="/app">QPoll</StyledHeaderLogo>
        <AppHeaderNavigationOutput itemsData={appHeaderData} />
        <Dropdown>
          <StyledHeaderProfile>
            {userData?.email ?? ''}({role})
            <ArrowDropDownIcon fontSize="small" />
          </StyledHeaderProfile>
          <Menu slots={{ listbox: Listbox }}>
            <MenuItem>
              <Button onClick={() => navigate('/app/profile')}>Профиль</Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={() => handleLogOut()}>Выйти из аккаунта</Button>
            </MenuItem>
          </Menu>
        </Dropdown>
      </StyledHeaderContainer>
    </StyledHeaderWrapper>
  );
};

export default AppHeader;
