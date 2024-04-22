import React, { useState } from 'react';
import AppHeaderNavigationOutput from '@/components/05_Features/AppHeaderNavOutput';
import {
  BurgerList,
  LinkWrapper,
  Listbox,
  StyledDrawer,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderProfile,
  StyledHeaderWrapper,
  StyledMenuIcon,
  UserEmail,
  UserInfo,
  UserRole,
  UserWrapper,
} from './styled';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useUserData from '@/hooks/useUserData';
import { appHeaderData } from '@/data/fields';
import { useUserRole } from '@/app/context/UserRoleProvider';
import { v4 } from 'uuid';

const AppHeader = () => {
  const { role } = useUserRole();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const userData = useUserData();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogOut = () => {
    setAuth(false);
    navigate('/');
  };
  // TODO - move burger to another component
  return (
    <StyledHeaderWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogo to="/">QPoll</StyledHeaderLogo>
        <AppHeaderNavigationOutput itemsData={appHeaderData} />
        <StyledMenuIcon onClick={toggleDrawer(true)} />
        <StyledDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <BurgerList>
            <UserWrapper to={'/app/profile'}>
              <Avatar src="/static/images/avatar/1.jpg" />
              <UserInfo>
                <UserEmail>{userData?.email ?? ''}</UserEmail>
                <UserRole>{role}</UserRole>
              </UserInfo>
              <KeyboardArrowRightIcon />
            </UserWrapper>
            {appHeaderData.map((item) => (
              <LinkWrapper key={v4()} to={item.to}>
                <item.icon />
                <Typography>{item.caption}</Typography>
              </LinkWrapper>
            ))}
            {role === 'Админ' && (
              <LinkWrapper key={v4()} to="/admin-panel">
                <AdminPanelSettingsIcon />
                <Typography>Админ-панель</Typography>
              </LinkWrapper>
            )}
          </BurgerList>
        </StyledDrawer>
        <Dropdown>
          <StyledHeaderProfile>
            {userData?.email ?? ''}({role})
            <AccountCircleIcon fontSize="small" />
          </StyledHeaderProfile>
          <Menu slots={{ listbox: Listbox }}>
            {role === 'Админ' && (
              <MenuItem>
                <Button onClick={() => navigate('/admin-panel')}> Админ-панель</Button>
              </MenuItem>
            )}
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
