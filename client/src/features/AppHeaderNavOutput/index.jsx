import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  StyledNavLink,
  StyledNavigation,
  StyledNavigationList,
} from './styled';

const AppHeaderNavigationOutput = ({ itemsData = [] }) => {
  return (
    <StyledNavigation>
      <StyledNavigationList>
        {itemsData.map((item) => {
          return (
            <StyledNavLink
              to={item.to}
              className={({ isActive, isPending }) =>
                isPending ? 'pending' : isActive ? 'active' : ''
              }
            >
              {item.caption}
            </StyledNavLink>
          );
        })}
      </StyledNavigationList>
    </StyledNavigation>
  );
};

export default AppHeaderNavigationOutput;
