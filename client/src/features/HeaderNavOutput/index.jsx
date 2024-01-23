import React from 'react';
import { LinksData } from '@/widgets/Header/data/NavigationLinksData';
import { v4 } from 'uuid';
import { StyledNavigation, StyledNavigationLink } from './styled';

const HeaderNavigationOutput = ({ children }) => {
  return (
    <StyledNavigation>
      {LinksData.map((item) => {
        return (
          <StyledNavigationLink key={v4()} to={item.to}>
            {item.caption}
          </StyledNavigationLink>
        );
      })}
      {children}
    </StyledNavigation>
  );
};

export default HeaderNavigationOutput;
