import React from 'react';
import { StyledNavLink, StyledNavigation, StyledNavigationList } from './styled';
import { v4 } from 'uuid';

const AppHeaderNavigationOutput = ({ itemsData = [] }) => {
  return (
    <StyledNavigation>
      <StyledNavigationList>
        {itemsData.map((item) => {
          return (
            <StyledNavLink
              end
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
