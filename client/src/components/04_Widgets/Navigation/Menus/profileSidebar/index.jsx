import React, { memo } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Box } from '@mui/material';
import { v4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledList,
  StyledNavItem,
  StyledNavItemCaption,
  StyledProfileContentWrapper,
  StyledProfileSidebarHeading,
  StyledProfileWrapper,
  CloseButtonWrapper,
} from './styled';

const ProfileSidebar = memo(({ linksData = {}, onClose }) => {
  return (
    <StyledProfileWrapper>
      <CloseButtonWrapper>
        <CloseIcon onClick={() => onClose()} sx={{ display: { xs: 'block', sm: 'none' } }} />
      </CloseButtonWrapper>
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
