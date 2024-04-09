import React, { memo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';
import { v4 } from 'uuid';
import {
  StyledList,
  StyledNavItem,
  StyledNavItemCaption,
  StyledProfileContentWrapper,
  StyledProfileSidebarHeading,
  StyledProfileWrapper,
} from './styled';

const ProfileSidebar = memo(({ linksData = {} }) => {
  return (
    <StyledProfileWrapper>
      <StyledProfileContentWrapper>
        <StyledList component="nav" aria-label="main mailbox folders">
          <ListItem>
            <StyledProfileSidebarHeading primary="Аккаунт" />
          </ListItem>
          {linksData.map((item) => (
            <StyledNavItem
              end
              key={v4()}
              to={item.to}
              className={({ isActive, isPending }) =>
                isPending ? 'pending' : isActive ? 'active' : ''
              }
            >
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <item.icon />
              </ListItemIcon>
              <StyledNavItemCaption primary={item.caption} />
            </StyledNavItem>
          ))}
        </StyledList>
        <Box sx={{ marginTop: 'auto' }}>
          <StyledNavItem to="/">
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Выход" />
          </StyledNavItem>
        </Box>
      </StyledProfileContentWrapper>
    </StyledProfileWrapper>
  );
});

export default ProfileSidebar;
