import React from 'react';
import { StyledNavLink, StyledNavigation, StyledNavigationList } from './styled';
import { v4 } from 'uuid';
import { useUserRole } from '@/app/context/UserRoleProvider';

const AppHeaderNavigationOutput = ({ itemsData = [] }) => {
  const { role } = useUserRole();

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
        {role === 'Админ' && (
          <StyledNavLink
            end
            key={v4()}
            to="/admin-panel"
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            Админ-панель
          </StyledNavLink>
        )}
      </StyledNavigationList>
    </StyledNavigation>
  );
};

export default AppHeaderNavigationOutput;
