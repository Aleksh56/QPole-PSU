import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  StyledNavLink,
  StyledNavigation,
  StyledNavigationList,
} from './styled';
import { v4 } from 'uuid';

const AppHeaderNavigationOutput = ({ itemsData = [] }) => {
  return (
    <StyledNavigation>
      <StyledNavigationList>
        {itemsData.map((item) => {
          return (
            <StyledNavLink
              key={v4()}
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
