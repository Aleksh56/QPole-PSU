import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Listbox,
  StyledHeaderContainer,
  StyledHeaderLogo,
  StyledHeaderProfile,
  StyledHeaderWrapper,
  StyledMenuIcon,
} from './styled';

import { useUserRole } from '@/app/context/UserRoleProvider';
import AppHeaderNavOut from '@/components/05_Features/DataDisplay/Out/appHeaderNavOut';
import AppBurgerMenu from '@/components/05_Features/UIComponents/Layouts/appBurger';
import { appHeaderData } from '@/data/fields';
import useAuth from '@/hooks/useAuth';
import useUserData from '@/hooks/useUserData';

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

  return (
    <StyledHeaderWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogo to="/">QPoll</StyledHeaderLogo>
        <AppHeaderNavOut itemsData={appHeaderData} />
        <StyledMenuIcon onClick={toggleDrawer(true)} />
        <AppBurgerMenu
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          userData={userData}
          role={role}
        />
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
