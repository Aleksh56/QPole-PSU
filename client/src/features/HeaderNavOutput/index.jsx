import React from 'react';
import { v4 } from 'uuid';
import { StyledNavigation, StyledNavigationLink } from './styled';
import { commonHeaderLinksData } from '@/data/fields';

const HeaderNavigationOutput = ({ children }) => {
  return (
    <StyledNavigation>
      {commonHeaderLinksData.map((item) => {
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
